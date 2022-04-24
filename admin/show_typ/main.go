package show_typ

import (
	"database/sql"
	"encoding/json"
	"lan-chat/admin"
	"lan-chat/admin/dbErrors"
	"lan-chat/admin/middleware"
	"lan-chat/httpErrors"
	"lan-chat/logger"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		http.HandlerFunc(listTypes).ServeHTTP(w, r)
	case http.MethodPost:
		middleware.AuthMiddleware(http.HandlerFunc(addType)).ServeHTTP(w, r)
	case http.MethodPut:
		middleware.AuthMiddleware(http.HandlerFunc(updateTypName)).ServeHTTP(w, r)
	case http.MethodDelete:
		middleware.AuthMiddleware(http.HandlerFunc(deleteType)).ServeHTTP(w, r)
	}
}

func listTypes(w http.ResponseWriter, r *http.Request) {
	rows, err := admin.Db.Query("SELECT id, typ FROM lan_show.show_type;")
	if dbErrors.InternalServerError(err) {
		httpErrors.InternalServerError(w)
		return
	}
	defer rows.Close()
	var (
		id  string
		typ string
	)
	var showTypes []ShowType
	for rows.Next() {
		err := rows.Scan(&id, &typ)
		if err != nil {
			if err == sql.ErrNoRows {
				httpErrors.NotFound(w, "No show types available")
				return
			}
			httpErrors.InternalServerError(w)
			return
		}
		showTypes = append(showTypes, ShowType{Id: id, Typ: typ})
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(showTypes)
	if err != nil {
		logger.ErrorLog.Println("Error while writing json response in listTypes: ", err)
		httpErrors.InternalServerError(w)
	}
}

func addType(w http.ResponseWriter, r *http.Request) {
	var showTyp ShowType
	err := json.NewDecoder(r.Body).Decode(&showTyp)
	logger.InfoLog.Println(showTyp)
	if err != nil || showTyp.Typ == "" {
		logger.ErrorLog.Println("Error while decoding showTyp: ", err)
		httpErrors.UnProcessableEntry(w)
		return
	}
	_, err = admin.Db.Exec("INSERT INTO lan_show.show_type (typ) VALUES ($1)", showTyp.Typ)
	if err != nil {
		if dbErrors.InternalServerError(err) {
			httpErrors.InternalServerError(w)
			return
		}
	}
	w.WriteHeader(http.StatusCreated)
	_, _ = w.Write([]byte("New Show Type Successfully created"))

}

func updateTypName(w http.ResponseWriter, r *http.Request) {
	showId := r.URL.Query().Get("id")
	if showId == "" {
		httpErrors.BadRequest(w, "unable to parse show id from query param(id)")
		return
	}
	var showType ShowType
	err := json.NewDecoder(r.Body).Decode(&showType)
	if err != nil || showType.Typ == "" {
		httpErrors.UnProcessableEntry(w)
		return
	}
	_, err = admin.Db.Exec("UPDATE lan_show.show_type SET typ=$1 WHERE id=$2", showType.Typ, showId)
	if err != nil && dbErrors.InternalServerError(err) {
		logger.ErrorLog.Println("Error while updating show type: ", err)
		httpErrors.InternalServerError(w)
		return

	}
	_, _ = w.Write([]byte("show type successfully updated..."))

}

func deleteType(w http.ResponseWriter, r *http.Request) {
	showId := r.URL.Query().Get("id")
	if showId != "" {
		_, err := admin.Db.Exec("DELETE FROM lan_show.show_type WHERE id=$1", showId)
		if err != nil && dbErrors.InternalServerError(err) {
			logger.ErrorLog.Println("Error while deleting show type: ", err)
			httpErrors.InternalServerError(w)
			return
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("Show type successfully deleted"))
		return
	}
	httpErrors.UnProcessableEntry(w, "showType not present")
}
