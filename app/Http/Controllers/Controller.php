<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
	public function toAscii($str, $replace=array(), $delimiter='-') {
		setlocale(LC_ALL, 'en_US.UTF8');
		$replace = [
			'đ' => 'd',
			'ổ' => 'o',
			'ồ' => 'o',
			'ố' => 'o',
			'ộ' => 'o',
			'ở' => 'o',
			'ờ' => 'o',
			'ớ' => 'o',
			'ợ' => 'o',
			'ế' => 'e',
			'ể' => 'e',
			'ề' => 'e',
			'ệ' => 'e',
			'ẩ' => 'a',
			'ấ' => 'a',
			'ầ' => 'a',
			'ậ' => 'a',
			'ắ' => 'a',
			'ẳ' => 'a',
			'ằ' => 'a',
			'ặ' => 'a',
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
