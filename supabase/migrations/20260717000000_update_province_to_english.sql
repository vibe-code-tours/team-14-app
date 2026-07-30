-- Migration: Update province names from Thai to English
-- Date: 2026-07-17
-- Description: Standardize province values to English for consistency with UI filters
--
-- Rollback: To revert, run the inverse UPDATE statements below:
--   UPDATE factories SET province = 'กรุงเทพมหานคร' WHERE province = 'Bangkok';
--   UPDATE factories SET province = 'ชลบุรี' WHERE province = 'Chonburi';
--   UPDATE factories SET province = 'ระยอง' WHERE province = 'Rayong';
--   UPDATE factories SET province = 'สมุทรปราการ' WHERE province = 'Samut Prakan';
--   UPDATE factories SET province = 'ปทุมธานี' WHERE province = 'Pathum Thani';
--   UPDATE factories SET province = 'นครราชสีมา' WHERE province = 'Nakhon Ratchasima';
--   UPDATE factories SET province = 'เชียงใหม่' WHERE province = 'Chiang Mai';
--   UPDATE factories SET province = 'ขอนแก่น' WHERE province = 'Khon Kaen';
--   UPDATE factories SET province = 'สงขลา' WHERE province = 'Songkhla';

BEGIN;

UPDATE factories
SET province = 'Bangkok'
WHERE province IN ('กรุงเทพมหานคร');

UPDATE factories
SET province = 'Chonburi'
WHERE province IN ('ชลบุรี');

UPDATE factories
SET province = 'Rayong'
WHERE province IN ('ระยอง');

UPDATE factories
SET province = 'Samut Prakan'
WHERE province IN ('สมุทรปราการ');

UPDATE factories
SET province = 'Pathum Thani'
WHERE province IN ('ปทุมธานี');

UPDATE factories
SET province = 'Nakhon Ratchasima'
WHERE province IN ('นครราชสีมา');

UPDATE factories
SET province = 'Chiang Mai'
WHERE province IN ('เชียงใหม่');

UPDATE factories
SET province = 'Khon Kaen'
WHERE province IN ('ขอนแก่น');

UPDATE factories
SET province = 'Songkhla'
WHERE province IN ('สงขลา');

COMMIT;
