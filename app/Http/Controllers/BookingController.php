<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 17-Nov-16
 * Time: 10:47 PM
 */

namespace App\Http\Controllers;


use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends ApiController
{
    public function index(Request $request){

        $data = Booking::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $booking  = Booking::find($id);

        if (!$booking) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$booking]);
    }

    public function create(Request $request){
        $booking = new Booking();
        $data = $request['data'];

        $booking->fill($data);

        if (!$booking->isValid()) {
            return $this->respondWithError(['error' => $booking->getValidationErrors()]);
        }
        try {
            $booking->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$booking]);
    }

    public function delete($id){

        $booking  = Booking::find($id);
        if (!$booking) {
            return $this->respondNotFound();
        }
        try {
            if (!$booking->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $booking = Booking::find($id);
        if(!$booking) {
            return $this->respondNotFound();
        }
        $data = $request['data'];

        $booking->fill($data);

        if (!$booking->isValid()) {
            return $this->respondWithError(['error' => $booking->getValidationErrors()]);
        }
        try {
            $booking->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$booking]);
    }
}