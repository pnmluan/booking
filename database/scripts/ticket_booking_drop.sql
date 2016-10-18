-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2016-10-18 17:01:17.315

-- foreign keys
ALTER TABLE booking
    DROP FOREIGN KEY booking_baggage_type;

ALTER TABLE booking
    DROP FOREIGN KEY booking_ticket_type;

ALTER TABLE contact
    DROP FOREIGN KEY contact_booking;

ALTER TABLE fare
    DROP FOREIGN KEY fare_passengers;

ALTER TABLE flight
    DROP FOREIGN KEY flight_booking;

ALTER TABLE flight
    DROP FOREIGN KEY flight_location_arrive;

ALTER TABLE flight
    DROP FOREIGN KEY flight_location_depart;

ALTER TABLE passengers
    DROP FOREIGN KEY passengers_booking;

ALTER TABLE ticket_type
    DROP FOREIGN KEY ticket_type_airlines;

-- tables
DROP TABLE airlines;

DROP TABLE baggage_type;

DROP TABLE banner;

DROP TABLE booking;

DROP TABLE contact;

DROP TABLE fare;

DROP TABLE flight;

DROP TABLE location;

DROP TABLE passengers;

DROP TABLE ticket_type;

-- End of file.

