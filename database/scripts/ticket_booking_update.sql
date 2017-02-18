ALTER TABLE `booking`.`contact` 
CHANGE COLUMN `booking_id` `booking_id` INT(11) NULL ,
ADD COLUMN `ticket_bill_id` INT(11) NULL AFTER `booking_id`;

ALTER TABLE `booking`.`ticket_bill` 
DROP COLUMN `contact_id`;