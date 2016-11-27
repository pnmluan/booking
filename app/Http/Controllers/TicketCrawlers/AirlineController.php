<?php

namespace App\Http\Controllers\TicketCrawlers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class AirlineController extends \App\Http\Controllers\ApiController
{
    public function index(){
        $arr = ['api'=> 'test'];
        return $this->respondWithSuccess(['data'=>$arr]);
    }

    public function test() {
        $str = 'Lượt đi 1 BL  790';
        echo substr($str, strpos($str,'Lượt đi') + 13, 8);
        exit;
    }

    public function vietjet(Request $request) {
        libxml_use_internal_errors(true);
        set_time_limit(0);
        require_once(base_path('app/Libraries/Curl.php'));

        // PREPARE PARAM
        $round_trip = $request->input('round_trip'); // Option: on, off
        if ($round_trip == 'off') $round_trip = '';

        $from = $request->input('from'); // Example: HAN
        $to = $request->input('to');    // Example: SGN
        $from_date = strtotime($request->input('from_date'));
        $to_date = strtotime($request->input('to_date'));
        $adult = $request->input('adult');
        $children = $request->input('children');
        $infant = $request->input('infant');

        // GET SESSION ID
        $url = 'http://www.vietjetair.com/Sites/Web/vi-VN/Home';

        $curl = new \Curl();

        $curl->get($url);

        $curl->setHeader('Host', 'book.vietjetair.com');
        $curl->setHeader('Referer', 'http://www.vietjetair.com/Sites/Web/vi-VN/Home');

        $curl->setCookie('ASP.NET_SessionId', $curl->getCookie('ASP.NET_SessionId'));

        // SEARCH FLIGHT
        $curl->post('https://book.vietjetair.com/ameliapost.aspx?lang=vi', array(
            'chkRoundTrip' => $round_trip,
            'lstOrigAP' => $from,
            'lstDestAP' => $to,
            'dlstDepDate_Day' => date('d', $from_date),
            'dlstDepDate_Month' => date('Y/m', $from_date),
            'dlstRetDate_Day' => date('d', $to_date),
            'dlstRetDate_Month' => date('Y/m', $to_date),
            'lstCurrency' => 'VND',
            'lstResCurrency' => 'VND',
            'lstDepDateRange' => 0,
            'lstRetDateRange' => 0,
            'txtNumAdults' => $adult,
            'txtNumChildren' => $children,
            'txtNumInfants' => $infant,
            'lstLvlService' => 1,
            'blnFares' => 'False',
            'txtPromoCode' => ''
        ));

        $curl->post('https://book.vietjetair.com/ameliapost.aspx?lang=vi', array(
            '__VIEWSTATE'=> '/wEPDwULLTE1MzQ1MjI3MzAPZBYCZg9kFg4CCA8QZGQWAGQCCQ8QZGQWAGQCCw8QZGQWAGQCDQ8QZGQWAGQCEQ8QZGQWAGQCEg8QZGQWAGQCEw8QZGQWAGRk/SLp6eYBboDTdTTmIOra109LSis=',
            '__VIEWSTATEGENERATOR' => '35449566',
            'SesID'=> '',
            'DebugID'=> 04,
            'lstOrigAP'=> -1,
            'lstDestAP'=> -1,
            'dlstDepDate_Day'=> date('d', $from_date),
            'dlstDepDate_Month'=> date('Y/m', $from_date),
            'lstDepDateRange'=> 0,
            'dlstRetDate_Day'=> date('d', $to_date),
            'dlstRetDate_Month'=> date('Y/m', $to_date),
            'lstRetDateRange'=> 0,
            'txtNumAdults'=> 0,
            'txtNumChildren'=> 0,
            'txtNumInfants'=> 0,
            'lstLvlService'=> 1,
            'lstResCurrency'=> 'VND',
            'lstCurrency'=> 'VND',
            'txtPromoCode'=> '',
        ));


        // GET DATA

        $curl->get('https://book.vietjetair.com//TravelOptions.aspx?lang=vi&st=pb&sesid=');

        $doc = new \DOMDocument();
        $doc->loadHTML($curl->response);
        $xpath = new \DOMXpath($doc);

        $result = [];

        // DEPARTURE FLIGHT
        $left_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')]/td[1]/table//tr/td");
        $right_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')]/td[2]/table//tr/td");

        for ($i = 0; $i < $left_fields->length / 4 ; $i++) {

            $start_date = substr($left_fields[$i * 4]->nodeValue, 0 ,10);

            $t = $left_fields[$i * 4 + 1]->nodeValue;
            $start_time = substr($t, 0, 5);
            // $start_from = substr($t, 10);
            // $start_code = substr($t, 7, 3);

            $t = $left_fields[$i * 4 + 2]->nodeValue;
            $end_time = substr($t, 0, 5);
            // $end_to = substr($t, 10);
            // $end_code = substr($t, 7, 3);

            $flight_code = substr($left_fields[$i * 4 + 3]->nodeValue, 0, 5);


            $data = [];
            $data['start_date'] = $start_date;
            $data['start_time'] = $start_time;
            $data['end_time'] = $end_time;
            $data['flight_code'] = $flight_code;


            $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='fare']");
            $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='charges']");

            if ($price->length > 0) {
                $data['price'] = substr(trim($price[0]->getAttribute('value')), 0, -4);
                $data['fee'] = substr(trim($fee[0]->getAttribute('value')), 0, -4);
                $data['fee_service'] = 0;
                $data['type'] = 'promo';
                $result['dep_flights'][] = $data;
            }


            $data = [];
            $data['start_date'] = $start_date;
            $data['start_time'] = $start_time;
            $data['end_time'] = $end_time;
            $data['flight_code'] = $flight_code;

            $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='fare']");
            $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='charges']");

            if ($price->length > 0) {
                $data['price'] = substr(trim($price[0]->getAttribute('value')), 0, -4);
                $data['fee'] = substr(trim($fee[0]->getAttribute('value')), 0, -4);
                $data['fee_service'] = 0;
                $data['type'] = 'eco';
                $result['dep_flights'][] = $data;
            }


            $data = [];
            $data['start_date'] = $start_date;
            $data['start_time'] = $start_time;
            $data['end_time'] = $end_time;
            $data['flight_code'] = $flight_code;

            $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='fare']");
            $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='charges']");

            if ($price->length > 0) {
                $data['price'] = substr(trim($price[0]->getAttribute('value')), 0, -4);
                $data['fee'] = substr(trim($fee[0]->getAttribute('value')), 0, -4);
                $data['fee_service'] = 0;
                $data['type'] = 'skyboss';
                $result['dep_flights'][] = $data;
            }

        }

        // RETURN FLIGHT
        if (!empty($round_trip)) {
            $left_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')]/td[1]/table//tr/td");
            $right_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')]/td[2]/table//tr/td");

            for ($i = 0; $i < $left_fields->length / 4 ; $i++) {

                $start_date = substr($left_fields[$i * 4]->nodeValue, 0 ,10);

                $t = $left_fields[$i * 4 + 1]->nodeValue;
                $start_time = substr($t, 0, 5);
                // $start_from = substr($t, 10);
                // $start_code = substr($t, 7, 3);

                $t = $left_fields[$i * 4 + 2]->nodeValue;
                $end_time = substr($t, 0, 5);
                // $end_to = substr($t, 10);
                // $end_code = substr($t, 7, 3);

                $flight_code = substr($left_fields[$i * 4 + 3]->nodeValue, 0, 5);


                $data = [];
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;


                $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='fare']");
                $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='charges']");

                if ($price->length > 0) {
                    $data['price'] = substr(trim($price[0]->getAttribute('value')), 0, -4);
                    $data['fee'] = substr(trim($fee[0]->getAttribute('value')), 0, -4);
                    $data['fee_service'] = 0;
                    $data['type'] = 'promo';
                    $result['ret_flights'][] = $data;
                }


                $data = [];
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;

                $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='fare']");
                $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='charges']");

                if ($price->length > 0) {
                    $data['price'] = substr(trim($price[0]->getAttribute('value')), 0, -4);
                    $data['fee'] = substr(trim($fee[0]->getAttribute('value')), 0, -4);
                    $data['fee_service'] = 0;
                    $data['type'] = 'eco';
                    $result['ret_flights'][] = $data;
                }


                $data = [];
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;

                $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='fare']");
                $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='charges']");

                if ($price->length > 0) {
                    $data['price'] = substr(trim($price[0]->getAttribute('value')), 0, -4);
                    $data['fee'] = substr(trim($fee[0]->getAttribute('value')), 0, -4);
                    $data['fee_service'] = 0;
                    $data['type'] = 'skyboss';
                    $result['ret_flights'][] = $data;
                }
            }
        }

        // $this->respondWithSuccess(['data'=> $result]);
        echo json_encode($result);
        exit;
    }

    public function jetstar(Request $request) {
        libxml_use_internal_errors(true);
        set_time_limit(0);
        require_once(base_path('app/Libraries/Curl.php'));

        // PREPARE PARAM
        $round_trip = $request->input('round_trip');

        if ($round_trip == 'on')
            $round_trip = 'RoundTrip';
        else if ($round_trip == 'off')
            $round_trip = 'OneWay';

        $from = $request->input('from');
        $to = $request->input('to');
        $from_date = strtotime($request->input('from_date'));
        $to_date = strtotime($request->input('to_date'));
        $adult = $request->input('adult');
        $children = $request->input('children');
        $infant = $request->input('infant');

        // GET SESSION ID
        $url = 'http://booknow.jetstar.com/Search.aspx?culture=vi-VN';

        $curl = new \Curl();

        $curl->get($url);

        $curl->setHeader('Host', 'booknow.jetstar.com');
        $curl->setHeader('Referer', 'http://booknow.jetstar.com/Search.aspx?culture=vi-VN');

        $curl->setCookie('ASP.NET_SessionId', $curl->getCookie('ASP.NET_SessionId'));

        // SEARCH FLIGHT
        $curl->post('http://booknow.jetstar.com/Search.aspx?culture=vi-VN', array(
            '__EVENTTARGET' => '',
            '__EVENTARGUMENT' => '',
            '__VIEWSTATE' => '/wEPDwUBMGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgEFJ01lbWJlckxvZ2luU2VhcmNoVmlldyRtZW1iZXJfUmVtZW1iZXJtZSDCMtVG/1lYc7dy4fVekQjBMvD5',
            'pageToken' => '',
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$RadioButtonMarketStructure' => $round_trip,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextBoxMarketOrigin1' => $from,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextBoxMarketDestination1' => $to,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextboxDepartureDate1' => date('d/m/Y', $from_date),
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextboxDestinationDate1' => date('d/m/Y', $to_date),
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListCurrency' => 'VND',
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextBoxMarketOrigin2' => $to,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextBoxMarketDestination2' => $from,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextboxDepartureDate2' => date('d/m/Y', $to_date),
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$TextboxDestinationDate2' => '',
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListPassengerType_ADT' => $adult,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListPassengerType_CHD' => $children,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$DropDownListPassengerType_INFANT' => $infant,
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$RadioButtonSearchBy' => 'SearchStandard',
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$numberTrips' => '2',
            'ControlGroupSearchView$AvailabilitySearchInputSearchView$ButtonSubmit' => '',
            'locale' => 'vi-VN',
        ));


        $curl->get('http://booknow.jetstar.com/Select.aspx');

        $doc = new \DOMDocument();
        $doc->loadHTML($curl->response);
        $xpath = new \DOMXpath($doc);

        $result = [];

        // DEPARTURE FLIGHT
        $k = 0;
        $fields = $xpath->query("(//table[@class='domestic'])[1]/tbody/tr/td");
        $prices = $xpath->query("//*[@name='ControlGroupSelectView\$AvailabilityInputSelectView\$market1']");
        $prices1 = $xpath->query("//*[@name='ControlGroupSelectView\$AvailabilityInputSelectView\$CheckBoxMkt1P']");
        $prices2 = $xpath->query("//*[@name='ControlGroupSelectView\$AvailabilityInputSelectView\$CheckBoxMkt1Y']");

        for ($i = 0; $i < ($fields->length - 2) / 4; $i++) {
            if ($xpath->query("(//table[@class='domestic'])[1]/tbody/tr[" . ($i + 1) . "]/td[4]/div[1]")->length > 0) {

                $str = $fields[$i * 4]->nodeValue;
                $start_time = substr($str, 0, strpos($str, ':') + 3);

                $str = $fields[$i * 4 + 1]->nodeValue;
                $end_time = substr($str, 0, strpos($str, ':') + 3);

                $str = $fields[$i * 4 + 2]->nodeValue;
                $str = substr($str, strpos($str, 'Lượt đi') + 14, 8);
                $str = implode('', explode('  ', $str));
                $flight_code = trim($str);

                $price = number_format($prices[$k]->getAttribute('data-price'));
                $price1 = number_format($prices1[$k]->getAttribute('data-price'));
                $price2 = number_format($prices2[$k]->getAttribute('data-price'));
                $fee = number_format($prices[$k]->getAttribute('data-discfees-adt'));
                $k++;

                // Vé tiết kiệm
                $data = [];
                $data['start_date'] = date('d/m/Y', $from_date);
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;
                $data['price'] = $price;
                $data['fee'] = $fee;
                $data['fee_service'] = 0;
                $data['type'] = 'Vé tiết kiệm';

                $result['dep_flights'][] = $data;

                // Vé linh hoạt
                $data = [];
                $data['start_date'] = date('d/m/Y', $from_date);
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;
                $data['price'] = $price;
                $data['fee'] = $fee;
                $data['fee_service'] = $price1;
                $data['type'] = 'Vé linh hoạt';

                $result['dep_flights'][] = $data;

                // Vé tối ưu
                $data = [];
                $data['start_date'] = date('d/m/Y', $from_date);
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;
                $data['price'] = $price;
                $data['fee'] = $fee;
                $data['fee_service'] = $price2;
                $data['type'] = 'Vé tối ưu';

                $result['dep_flights'][] = $data;
            }
        }

        // RETURN FLIGHT
        if (!empty($round_trip) && $round_trip == 'RoundTrip') {

            $fields = $xpath->query("(//table[@class='domestic'])[2]/tbody/tr/td");
            $prices = $xpath->query("//*[@name='ControlGroupSelectView\$AvailabilityInputSelectView\$market2']");
            $prices1 = $xpath->query("//*[@name='ControlGroupSelectView\$AvailabilityInputSelectView\$CheckBoxMkt2P']");
            $prices2 = $xpath->query("//*[@name='ControlGroupSelectView\$AvailabilityInputSelectView\$CheckBoxMkt2Y']");

            $k = 0;

            for ($i = 0; $i < ($fields->length - 2) / 4; $i++) {
                if ($xpath->query("(//table[@class='domestic'])[2]/tbody/tr[" . ($i + 1) . "]/td[4]/div[1]")->length > 0) {

                    $str = $fields[$i * 4]->nodeValue;
                    $start_time = substr($str, 0, strpos($str, ':') + 3);

                    $str = $fields[$i * 4 + 1]->nodeValue;
                    $end_time = substr($str, 0, strpos($str, ':') + 3);

                    $str = $fields[$i * 4 + 2]->nodeValue;
                    $str = substr($str, strpos($str, 'Lượt về') + 14, 8);
                    $str = implode('', explode('  ', $str));
                    $flight_code = trim($str);

                    $price = number_format($prices[$k]->getAttribute('data-price'));
                    $price1 = number_format($prices1[$k]->getAttribute('data-price'));
                    $price2 = number_format($prices2[$k]->getAttribute('data-price'));
                    $fee = number_format($prices[$k]->getAttribute('data-discfees-adt'));
                    $k++;

                    // Vé tiết kiệm
                    $data = [];
                    $data['start_date'] = date('d/m/Y', $to_date);
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['flight_code'] = $flight_code;
                    $data['price'] = $price;
                    $data['fee'] = $fee;
                    $data['fee_service'] = 0;
                    $data['type'] = 'Vé tiết kiệm';

                    $result['ret_flights'][] = $data;

                    // Vé linh hoạt
                    $data = [];
                    $data['start_date'] = date('d/m/Y', $to_date);
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['flight_code'] = $flight_code;
                    $data['price'] = $price;
                    $data['fee'] = $fee;
                    $data['fee_service'] = $price1;
                    $data['type'] = 'Vé linh hoạt';

                    $result['ret_flights'][] = $data;

                    // Vé tối ưu
                    $data = [];
                    $data['start_date'] = date('d/m/Y', $to_date);
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['flight_code'] = $flight_code;
                    $data['price'] = $price;
                    $data['fee'] = $fee;
                    $data['fee_service'] = $price2;
                    $data['type'] = 'Vé tối ưu';

                    $result['ret_flights'][] = $data;
                }
            }
        }

        // $this->respondWithSuccess(['data'=> $result]);
        echo json_encode($result);
        exit;
    }


    public function vna(Request $request) {
        libxml_use_internal_errors(true);
        set_time_limit(0);
        require_once(base_path('app/Libraries/Curl.php'));

        // PREPARE PARAM
        $round_trip = $request->input('round_trip');

        if ($round_trip == 'on')
            $round_trip = 'RT';
        else if ($round_trip == 'off')
            $round_trip = 'OW';

        $from = $request->input('from');
        $to = $request->input('to');
        $from_date = strtotime($request->input('from_date'));
        $to_date = strtotime($request->input('to_date'));
        $adult = $request->input('adult');
        $children = $request->input('children');
        $infant = $request->input('infant');

        // SEARCH FLIGHT
        $curl = new \Curl();

        $curl->get('https://wl-prod.sabresonicweb.com/SSW2010/VNVN/webqtrip.html?' .
            'searchType=NORMAL' .
            "&lang=vi_VN" .
            "&journeySpan=" . $round_trip .
            "&origin=" . $from .
            "&destination=" . $to .
            "&numAdults=" . $adult .
            "&numChildren=" . $children .
            "&numInfants=" . $infant .
            "&promoCode=" .
            "&alternativeLandingPage=true" .
            "&departureDate=" . date('Y-m-d', $from_date) .
            (($round_trip == 'RT') ? "&returnDate=" . date('Y-m-d', $to_date) : '')
        );

        $curl->setCookie('JSESSIONID', $curl->getCookie('JSESSIONID'));
        $curl->setCookie('WLPCOOKIE', $curl->getCookie('WLPCOOKIE'));
        $curl->setCookie('SSWGID', $curl->getCookie('SSWGID'));

        $curl->get('https://wl-prod.sabresonicweb.com/SSW2010/VNVN/webqtrip.html?execution=e1s1');

        $doc = new \DOMDocument();
        $doc->loadHTML($curl->response);
        $xpath = new \DOMXpath($doc);

        $result = [];


        // DEPARTURE FLIGHT
        $flight_codes = $xpath->query("//*[@id='outbounds']//*[@class='flight-number']");
        $start_times = $xpath->query("//*[@id='outbounds']//th[3]//*[@class='translate time wasTranslated']");
        $end_times = $xpath->query("//*[@id='outbounds']//th[4]//*[@class='translate time wasTranslated']");

        for ($i = 0; $i < $flight_codes->length; $i++) {
            $flight_code = $flight_codes[$i]->nodeValue;
            $start_time = $start_times[$i]->nodeValue;
            $end_time = $end_times[$i]->nodeValue;
            $start_date = date('d/m/Y', $from_date);

            // Thương gia Linh hoạt
            $price = $xpath->query("(//*[@id='outbounds']//td[1]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

            if ($price->length > 0) {
                $data = [];
                $data['flight_code'] = $flight_code;
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['price'] = $price[0]->nodeValue;
                $data['type'] = 'Thương gia Linh hoạt';

                $result['dep_flights'][] = $data;
            }

            // Thương gia Tiêu chuẩn
            $price = $xpath->query("(//*[@id='outbounds']//td[2]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

            if ($price->length > 0) {
                $data = [];
                $data['flight_code'] = $flight_code;
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['price'] = $price[0]->nodeValue;
                $data['type'] = 'Thương gia Tiêu chuẩn';

                $result['dep_flights'][] = $data;
            }

            // Phổ thông linh hoạt
            $price = $xpath->query("(//*[@id='outbounds']//td[3]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

            if ($price->length > 0) {
                $data = [];
                $data['flight_code'] = $flight_code;
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['price'] = $price[0]->nodeValue;
                $data['type'] = 'Phổ thông linh hoạt';

                $result['dep_flights'][] = $data;
            }

            // Phổ thông Tiêu chuẩn
            $price = $xpath->query("(//*[@id='outbounds']//td[4]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

            if ($price->length > 0) {
                $data = [];
                $data['flight_code'] = $flight_code;
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['price'] = $price[0]->nodeValue;
                $data['type'] = 'Phổ thông Tiêu chuẩn';

                $result['dep_flights'][] = $data;
            }

            // Phổ thông Phổ thông Tiết kiệm
            $price = $xpath->query("(//*[@id='outbounds']//td[5]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

            if ($price->length > 0) {
                $data = [];
                $data['flight_code'] = $flight_code;
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['price'] = $price[0]->nodeValue;
                $data['type'] = 'Phổ thông Phổ thông Tiết kiệm';

                $result['dep_flights'][] = $data;
            }
        }


        // RETURN FLIGHT
        if (!empty($round_trip) && $round_trip == 'RT') {
            $flight_codes = $xpath->query("//*[@id='inbounds']//*[@class='flight-number']");
            $start_times = $xpath->query("//*[@id='inbounds']//th[3]//*[@class='translate time wasTranslated']");
            $end_times = $xpath->query("//*[@id='inbounds']//th[4]//*[@class='translate time wasTranslated']");

            for ($i = 0; $i < $flight_codes->length; $i++) {
                $flight_code = $flight_codes[$i]->nodeValue;
                $start_time = $start_times[$i]->nodeValue;
                $end_time = $end_times[$i]->nodeValue;
                $start_date = date('d/m/Y', $to_date);

                // Thương gia Linh hoạt
                $price = $xpath->query("(//*[@id='inbounds']//td[1]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

                if ($price->length > 0) {
                    $data = [];
                    $data['flight_code'] = $flight_code;
                    $data['start_date'] = $start_date;
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['price'] = $price[0]->nodeValue;
                    $data['type'] = 'Thương gia Linh hoạt';

                    $result['ret_flights'][] = $data;
                }

                // Thương gia Tiêu chuẩn
                $price = $xpath->query("(//*[@id='inbounds']//td[2]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

                if ($price->length > 0) {
                    $data = [];
                    $data['flight_code'] = $flight_code;
                    $data['start_date'] = $start_date;
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['price'] = $price[0]->nodeValue;
                    $data['type'] = 'Thương gia Tiêu chuẩn';

                    $result['ret_flights'][] = $data;
                }

                // Phổ thông linh hoạt
                $price = $xpath->query("(//*[@id='inbounds']//td[3]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

                if ($price->length > 0) {
                    $data = [];
                    $data['flight_code'] = $flight_code;
                    $data['start_date'] = $start_date;
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['price'] = $price[0]->nodeValue;
                    $data['type'] = 'Phổ thông linh hoạt';

                    $result['ret_flights'][] = $data;
                }

                // Phổ thông Tiêu chuẩn
                $price = $xpath->query("(//*[@id='inbounds']//td[4]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

                if ($price->length > 0) {
                    $data = [];
                    $data['flight_code'] = $flight_code;
                    $data['start_date'] = $start_date;
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['price'] = $price[0]->nodeValue;
                    $data['type'] = 'Phổ thông Tiêu chuẩn';

                    $result['ret_flights'][] = $data;
                }

                // Phổ thông Phổ thông Tiết kiệm
                $price = $xpath->query("(//*[@id='inbounds']//td[5]//div[@class='outer'])[" . ($i + 1) ."]//*[@class='prices-amount']");

                if ($price->length > 0) {
                    $data = [];
                    $data['flight_code'] = $flight_code;
                    $data['start_date'] = $start_date;
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['price'] = $price[0]->nodeValue;
                    $data['type'] = 'Phổ thông Phổ thông Tiết kiệm';

                    $result['ret_flights'][] = $data;
                }
            }
        }



        // $this->respondWithSuccess(['data'=> $result]);
        echo json_encode($result);
        exit;
    }
}
