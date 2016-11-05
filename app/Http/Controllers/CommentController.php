<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class CommentController extends ApiController{

    public function index(Request $request){

        // DB table to use
        $table = 'comment';
         
        // Table's primary key
        $primaryKey = 'id';
         
        // Array of database columns which should be read and sent back to DataTables.
        // The `db` parameter represents the column name in the database, while the `dt`
        // parameter represents the DataTables column identifier. In this case simple
        // indexes
        $columns = array(
            array( 'db' => 'full_name', 'dt' => 'full_name' ),
            array( 'db' => 'content',  'dt' => 'content' ),
            array( 'db' => 'status',   'dt' => 'status' ),
        );
         
        // SQL server connection information
        
         
         
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * If you just want to use the basic configuration for DataTables with PHP
         * server-side, there is no need to edit below this line.
         */

         
        echo json_encode(
            self::simple( $_GET, $table, $primaryKey, $columns )
        );
die;
        // $arrData = [
        //     'draw' => 1,
        //     'recordsFiltered' => 10,
        //     'recordsTotal' => count($comment),
        //     'data' => $comment
        // ];
        // return $this->respondWithSuccess($arrData);
    }

    public function show($id) {

        $comment  = Comment::find($id);

        if (!$comment) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$comment]);
    }

    public function create(Request $request){
        $comment = new Comment();
        $data = $request->all();
        $comment->fill($data);

        if (!$comment->isValid()) {
            return $this->respondWithError(['error' => $comment->getValidationErrors()]);
        }
        try {
            $comment->save();
        } catch (\Exception $ex) {
            var_dump($ex);die;
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$comment]);
    }

    public function delete($id){

        $comment  = Comment::find($id);
        if (!$comment) {
            return $this->respondNotFound();
        }
        try {
            if (!$comment->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){
        
        $comment = Comment::find($id);
        if(!$comment) {
            return $this->respondNotFound();
        }
        $data = $request->all();
        $comment->fill($data);

        if (!$comment->isValid()) {
            return $this->respondWithError(['error' => $comment->getValidationErrors()]);
        }
        try {
            $comment->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$comment]);
    }
}
?>