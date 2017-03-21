<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
	public function toAscii($str, $replace=array(), $delimiter='-') {
		setlocale(LC_ALL, 'en_US.UTF8');
		$replace = [
			'đ' => 'd',
			'ô' => 'o',
			'ổ' => 'o',
			'ồ' => 'o',
			'ố' => 'o',
			'ộ' => 'o',
			'ở' => 'o',
			'ờ' => 'o',
			'ớ' => 'o',
			'ợ' => 'o',
			'é' => 'e',
			'ê' => 'e',
			'ế' => 'e',
			'ề' => 'e',
			'ể' => 'e',
			'ệ' => 'e',
			'á' => 'a',
			'à' => 'a',
			'ả' => 'a',
			'ạ' => 'a',
			'ẩ' => 'a',
			'ấ' => 'a',
			'ầ' => 'a',
			'ậ' => 'a',
			'ắ' => 'a',
			'ẳ' => 'a',
			'ằ' => 'a',
			'ặ' => 'a',
			'ị' => 'i',
			'ủ' => 'u',
			'ụ' => 'u',
			'ư' => 'u',
			'ử' => 'u',
			'ứ' => 'u',
			'ừ' => 'u',
			'ự' => 'u'
		];
		if( !empty($replace) ) {

			foreach($replace as $key=>$value) {
	    	    $str = str_replace($key, $value, $str);
	    	}
		}

		$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
		return $clean;
	}
}
