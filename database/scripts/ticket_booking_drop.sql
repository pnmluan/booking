-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-11-10 16:56:11.041

-- foreign keys
ALTER TABLE baggage_type
    DROP FOREIGN KEY baggage_type_provider;

ALTER TABLE booking
    DROP FOREIGN KEY booking_ticket_type;

ALTER TABLE bus_route
    DROP FOREIGN KEY bus_route_ticket_type;

ALTER TABLE contact
    DROP FOREIGN KEY contact_booking;

ALTER TABLE fare
    DROP FOREIGN KEY fare_baggage_type;

ALTER TABLE fare
    DROP FOREIGN KEY fare_passengers;

ALTER TABLE booking_detail
    DROP FOREIGN KEY flight_booking;

ALTER TABLE booking_detail
    DROP FOREIGN KEY flight_location_arrive;

ALTER TABLE booking_detail
    DROP FOREIGN KEY flight_location_depart;

ALTER TABLE passenger
    DROP FOREIGN KEY passengers_booking;

ALTER TABLE ticket_type
    DROP FOREIGN KEY ticket_type_airlines;

-- tables
DROP TABLE baggage_type;

DROP TABLE banner;

DROP TABLE booking;

DROP TABLE booking_detail;

DROP TABLE bus_route;

DROP TABLE comment;

DROP TABLE contact;

DROP TABLE fare;

DROP TABLE location;

DROP TABLE passenger;

DROP TABLE provider;

DROP TABLE ticket_type;

-- End of file.

