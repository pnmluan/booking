<?php
/**
 * Created by PhpStorm.
 * User: hsb
 * Date: 13-Nov-16
 * Time: 9:07 AM
 */
namespace App\Http\Controllers;

use App\Models\Provider;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProviderController extends ApiController
{
    public function index(Request $request){

        $data = Provider::listItems($request->all());
        return response()->json($data);

    }

    public function show($id) {

        $provider  = Provider::find($id);

        if (!$provider) {
            return $this->respondNotFound();
        }
        return $this->respondWithSuccess(['data'=>$provider]);
    }

    public function create(Request $request){
        $provider = new Provider();
        $data = $request->all();

        $provider->fill($data);

        if (!$provider->isValid()) {
            return $this->respondWithError(['error' => $provider->getValidationErrors()]);
        }
        try {
            $provider->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }
        return $this->respondWithCreated(['data'=>$provider]);
    }

    public function delete($id){

        $provider  = Provider::find($id);
        if (!$provider) {
            return $this->respondNotFound();
        }
        try {
            if (!$provider->delete()) {
                return $this->respondWithError();
            }
        } catch (\Exception $ex) {
            return $this->respondWithError(['error' => $ex->getMessage()]);
        }
        return $this->respondWithSuccess(['record_id'=>$id]);
    }

    public function update(Request $request, $id){

        $provider = Provider::find($id);
        if(!$provider) {
            return $this->respondNotFound();
        }
        $data = $request->all();

        $provider->fill($data);

        if (!$provider->isValid()) {
            return $this->respondWithError(['error' => $provider->getValidationErrors()]);
        }
        try {
            $provider->save();
        } catch (\Exception $ex) {
            return $this->respondWithNotSaved();
        }

        return $this->respondWithSaved(['data'=>$provider]);
    }
}