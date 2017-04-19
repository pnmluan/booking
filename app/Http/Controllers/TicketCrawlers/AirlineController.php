<?php

namespace App\Http\Controllers\TicketCrawlers;

use App\Http\Controllers\ApiController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


class AirlineController extends ApiController
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

            $t = $left_fields[$i * 4 + 2]->nodeValue;
            $end_time = substr($t, 0, 5);

            $flight_code = substr($left_fields[$i * 4 + 3]->nodeValue, 0, 5);

            $min = null;
            $data = [];
            $data['start_date'] = $start_date;
            $data['start_time'] = $start_time;
            $data['end_time'] = $end_time;
            $data['flight_code'] = $flight_code;


            $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='fare']");
            $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='charges']");

            if ($price->length > 0) {
                $data['price'] = str_replace(',', '', substr(trim($price[0]->getAttribute('value')), 0, -4));
                $data['fee'] = str_replace(',', '', substr(trim($fee[0]->getAttribute('value')), 0, -4));
                $data['fee_service'] = 0;
                $data['type'] = 'promo';
                $min = $data;
            }

            $data = [];
            $data['start_date'] = $start_date;
            $data['start_time'] = $start_time;
            $data['end_time'] = $end_time;
            $data['flight_code'] = $flight_code;

            $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='fare']");
            $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='charges']");

            if ($price->length > 0) {
                $data['price'] = str_replace(',', '', substr(trim($price[0]->getAttribute('value')), 0, -4));
                $data['fee'] = str_replace(',', '', substr(trim($fee[0]->getAttribute('value')), 0, -4));
                $data['fee_service'] = 0;
                $data['type'] = 'eco';


                if ($min) {
                    if (intval($min['price']) > intval($data['price']))
                        $min = $data;
                } else {
                    $min = $data;
                }

            }


            $data = [];
            $data['start_date'] = $start_date;
            $data['start_time'] = $start_time;
            $data['end_time'] = $end_time;
            $data['flight_code'] = $flight_code;

            $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='fare']");
            $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptDep')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='charges']");

            if ($price->length > 0) {
                $data['price'] = str_replace(',', '', substr(trim($price[0]->getAttribute('value')), 0, -4));
                $data['fee'] = str_replace(',', '', substr(trim($fee[0]->getAttribute('value')), 0, -4));
                $data['fee_service'] = 0;
                $data['type'] = 'skyboss';
                if ($min) {
                    if (intval($min['price']) > intval($data['price']))
                        $min = $data;
                } else {
                    $min = $data;
                }
            }

            if ($min)
                $result['dep_flights'][] = $min;
        }

        // RETURN FLIGHT
        if (!empty($round_trip)) {
            $left_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')]/td[1]/table//tr/td");
            $right_fields = $xpath->query("//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')]/td[2]/table//tr/td");

            for ($i = 0; $i < $left_fields->length / 4 ; $i++) {

                $start_date = substr($left_fields[$i * 4]->nodeValue, 0 ,10);

                $t = $left_fields[$i * 4 + 1]->nodeValue;
                $start_time = substr($t, 0, 5);

                $t = $left_fields[$i * 4 + 2]->nodeValue;
                $end_time = substr($t, 0, 5);


                $flight_code = substr($left_fields[$i * 4 + 3]->nodeValue, 0, 5);

                $min = null;
                $data = [];
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;


                $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='fare']");
                $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[1]/*[@id='charges']");

                if ($price->length > 0) {
                    $data['price'] = str_replace(',', '', substr(trim($price[0]->getAttribute('value')), 0, -4));
                    $data['fee'] = str_replace(',', '', substr(trim($fee[0]->getAttribute('value')), 0, -4));
                    $data['fee_service'] = 0;
                    $data['type'] = 'promo';
                    $min = $data;
                }


                $data = [];
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;

                $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='fare']");
                $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[2]/*[@id='charges']");

                if ($price->length > 0) {
                    $data['price'] = str_replace(',', '', substr(trim($price[0]->getAttribute('value')), 0, -4));
                    $data['fee'] = str_replace(',', '', substr(trim($fee[0]->getAttribute('value')), 0, -4));
                    $data['fee_service'] = 0;
                    $data['type'] = 'eco';
                    if ($min) {
                        if (intval($min['price']) > intval($data['price']))
                            $min = $data;
                    } else {
                        $min = $data;
                    }
                }


                $data = [];
                $data['start_date'] = $start_date;
                $data['start_time'] = $start_time;
                $data['end_time'] = $end_time;
                $data['flight_code'] = $flight_code;

                $price = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='fare']");
                $fee = $xpath->query("(//*[@id='travOpsMain']/table//tr[7]/td/table//tr[contains(substring(@id, 1, 16), 'gridTravelOptRet')])[" . ($i + 1) . "]/td[2]/table//tr/td[3]/*[@id='charges']");

                if ($price->length > 0) {
                    $data['price'] = str_replace(',', '', substr(trim($price[0]->getAttribute('value')), 0, -4));
                    $data['fee'] = str_replace(',', '', substr(trim($fee[0]->getAttribute('value')), 0, -4));
                    $data['fee_service'] = 0;
                    $data['type'] = 'skyboss';
                    if ($min) {
                        if (intval($min['price']) > intval($data['price']))
                            $min = $data;
                    } else {
                        $min = $data;
                    }
                }

                if ($min)
                    $result['ret_flights'][] = $min;
            }
        }

        echo json_encode($result);
        exit;
    }

    public function jetstar(Request $request) {
        libxml_use_internal_errors(true);
        set_time_limit(0);
        require_once(base_path('app/Libraries/Curl.php'));

        // PREPARE PARAM
        $from = $request->input('from');
        $to = $request->input('to');
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $adult = $request->input('adult');
        $children = $request->input('children') ?: 0;
        $infant = $request->input('infant') ?: 0;

        $round_trip = $request->input('round_trip');

        if ($round_trip == 'on') {

            $url = 'https://booking.jetstar.com/vn/vi/booking/search-flights?origin1=' . $from . '&destination1=' . $to . '&departuredate1=' . $from_date . '&origin2=' . $to . '&destination2=' . $from . '&departuredate2=' . $to_date . '&adults=' . $adult . '&children=' . $children . '&infants=' . $infant . '&currency=VND';

            $prefix_search = "//div[contains(@class, 'js-outbound')]";

        } else if ($round_trip == 'off') {

            $url = 'https://booking.jetstar.com/vn/vi/booking/search-flights?origin1=' . $from . '&destination1=' . $to . '&departuredate1=' . $from_date . '&adults=' . $adult . '&children=' . $children . '&infants=' . $infant . '&currency=VND';

            $prefix_search = "";
        }

        // GET SESSION ID
        $again = 0;
        begin:
        $again++;

        $curl = new \Curl();

        $curl->get($url);

        $curl->setCookie('ASP.NET_SessionId', $curl->getCookie('ASP.NET_SessionId'));

        $curl->get('https://booking.jetstar.com/vn/vi/booking/select-flights');

        $doc = new \DOMDocument();
        $doc->loadHTML($curl->response);
        $xpath = new \DOMXpath($doc);

        $result = [];

        // DEPARTURE FLIGHT
        $k = 0;
        $fields = $xpath->query($prefix_search . "//input[@class='js-flight-selection']");

        for ($i = 0; $i < ($fields->length); $i++) {

            $data = [];
            $data['start_date'] = date('d/m/Y', strtotime($from_date));
            $data['start_time'] = substr($fields[$i]->getAttribute('data-departure-time'), 11);
            $data['end_time'] = substr($fields[$i]->getAttribute('data-arrival-time'), 11);
            $data['flight_code'] = $fields[$i]->getAttribute('data-flightnumber');
            $data['price'] = intval($fields[$i]->getAttribute('data-per-pax-amount'));
            $data['fee'] = json_decode($fields[$i]->getAttribute('data-price-breakdown'), true)['PriceBreakdown'][0]['Fees'];
            $data['fee_service'] = 0;
            $data['type'] = 'Vé tiết kiệm';

            $result['dep_flights'][] = $data;
        }

        // RETURN FLIGHT
        if (!empty($round_trip) && $round_trip == 'on') {

            $fields = $xpath->query("//div[contains(@class, 'js-inbound')]//input[@class='js-flight-selection']");

            for ($i = 0; $i < ($fields->length); $i++) {

                $data = [];
                $data['start_date'] = date('d/m/Y', strtotime($to_date));
                $data['start_time'] = substr($fields[$i]->getAttribute('data-departure-time'), 11);
                $data['end_time'] = substr($fields[$i]->getAttribute('data-arrival-time'), 11);
                $data['flight_code'] = $fields[$i]->getAttribute('data-flightnumber');
                $data['price'] = intval($fields[$i]->getAttribute('data-per-pax-amount'));
                $data['fee'] = json_decode($fields[$i]->getAttribute('data-price-breakdown'), true)['PriceBreakdown'][0]['Fees'];
                $data['fee_service'] = 0;
                $data['type'] = 'Vé tiết kiệm';

                $result['ret_flights'][] = $data;
            }
        }

        if (empty($result) && $again < 3)
            goto begin;

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

        $again = 0;
        begin:
        $again++;
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

        if (empty($curl->response) && $again < 3)
            goto begin;
        else if ($again >= 3) {
            echo 'Page return emtpy';
            exit;
        }

        $doc = new \DOMDocument();
        $doc->loadHTML($curl->response);
        $xpath = new \DOMXpath($doc);

        $result = [];

        // DEPARTURE FLIGHT
        $id = ($round_trip == 'RT') ? 'outbounds' : 'both';
        $flight_codes = $xpath->query("//*[@id='" . $id . "']//*[@class='flight-number']");
        $start_times = $xpath->query("//*[@id='" . $id . "']/div/fieldset/table/tbody/tr/th[3]/span[@class='translate time wasTranslated']");
        $end_times = $xpath->query("//*[@id='" . $id . "']/div/fieldset/table/tbody/tr/th[4]/span[@class='translate time wasTranslated']");

        $temp = $xpath->query("//*[@id='" . $id . "']/div/fieldset/table/thead/tr/th[@class='price ']");

        $types = [];

        foreach ($temp as $key => $value) {
            array_push($types, $value);
        }

        array_push($types, $xpath->query("//*[@id='" . $id . "']/div/fieldset/table/thead/tr/th[@class='price yui-dt-last']")[0]);

        for ($i = 0; $i < $flight_codes->length; $i++) {
            $flight_code = $flight_codes[$i]->nodeValue;
            $start_time = $start_times[$i]->nodeValue;
            $end_time = $end_times[$i]->nodeValue;
            $start_date = date('d/m/Y', $from_date);

            $min = null;

            foreach ($types as $index => $type) {
                $price = $xpath->query("(//*[@id='" . $id . "']/div/fieldset/table/tbody/tr/td[" . ($index + 1) . "]/div/div)[" . ($i + 1) ."]/div/label/span/span/span[1]");

                if ($price->length > 0) {
                    $data = [];
                    $data['flight_code'] = $flight_code;
                    $data['start_date'] = $start_date;
                    $data['start_time'] = $start_time;
                    $data['end_time'] = $end_time;
                    $data['price'] = str_replace(',', '', $price[0]->nodeValue);
                    $data['type'] = utf8_decode($type->nodeValue);

                    if ($min) {
                        if (intval($min['price']) > intval($data['price']))
                            $min = $data;
                    } else {
                        $min = $data;
                    }
                }
            }

            if ($min)
                $result['dep_flights'][] = $min;
        }

        // RETURN FLIGHT
        if (!empty($round_trip) && $round_trip == 'RT') {
            $flight_codes = $xpath->query("//*[@id='inbounds']//*[@class='flight-number']");
            $start_times = $xpath->query("//*[@id='inbounds']/div/fieldset/table/tbody/tr/th[3]/span[@class='translate time wasTranslated']");
            $end_times = $xpath->query("//*[@id='inbounds']/div/fieldset/table/tbody/tr/th[4]/span[@class='translate time wasTranslated']");

            $temp = $xpath->query("//*[@id='inbounds']/div/fieldset/table/thead/tr/th[@class='price ']");

            $types = [];

            foreach ($temp as $key => $value) {
                array_push($types, $value);
            }

            array_push($types, $xpath->query("//*[@id='inbounds']/div/fieldset/table/thead/tr/th[@class='price yui-dt-last']")[0]);

            for ($i = 0; $i < $flight_codes->length; $i++) {
                $flight_code = $flight_codes[$i]->nodeValue;
                $start_time = $start_times[$i]->nodeValue;
                $end_time = $end_times[$i]->nodeValue;
                $start_date = date('d/m/Y', $to_date);

                $min = null;

                foreach ($types as $index => $type) {
                    $price = $xpath->query("(//*[@id='inbounds']/div/fieldset/table/tbody/tr/td[" . ($index + 1) . "]/div/div)[" . ($i + 1) ."]/div/label/span/span/span[1]");

                    if ($price->length > 0) {
                        $data = [];
                        $data['flight_code'] = $flight_code;
                        $data['start_date'] = $start_date;
                        $data['start_time'] = $start_time;
                        $data['end_time'] = $end_time;
                        $data['price'] = str_replace(',', '', $price[0]->nodeValue);
                        $data['type'] = utf8_decode($type->nodeValue);

                        if ($min) {
                            if (intval($min['price']) > intval($data['price']))
                                $min = $data;
                        } else {
                            $min = $data;
                        }
                    }
                }

                if ($min)
                    $result['ret_flights'][] = $min;
            }
        }

        echo json_encode($result);
        exit;
    }
}
