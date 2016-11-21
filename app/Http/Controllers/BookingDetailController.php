<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 17-Nov-16
 * Time: 11:26 PM
 */

namespace App\Http\Controllers;


use App\Models\BookingDetail;
use Illuminate\Http\Request;

class BookingDetailController extends ApiController
{
    public function index(Request $request){

        $data = BookingDetail::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $bookingDetail  = BookingDetail::find($id);

        if (!$bookingDetail) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$bookingDetail]);
    }

    public function create(Request $request){
        $bookingDetail = new BookingDetail();
        $data = $request['data'];

        $bookingDetail->fill($data);

        if (!$bookingDetail->isValid()) {
            return $this->respondWithError(['error' => $bookingDetail->getValidationErrors()]);
        }
        try {
            $bookingDetail->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$bookingDetail]);
    }

    public function delete($id){

        $bookingDetail  = BookingDetail::find($id);
        if (!$bookingDetail) {
            return $this->respondNotFound();
        }
        try {
            if (!$bookingDetail->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $bookingDetail = BookingDetail::find($id);
        if(!$bookingDetail) {
            return $this->respondNotFound();
        }
        $data = $request['data'];

        $bookingDetail->fill($data);

        if (!$bookingDetail->isValid()) {
            return $this->respondWithError(['error' => $bookingDetail->getValidationErrors()]);
        }
        try {
            $bookingDetail->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$bookingDetail]);
    }
}