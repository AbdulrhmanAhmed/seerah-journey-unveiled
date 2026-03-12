
-- Fix path step coordinates for "Migration to Abyssinia" (eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198)
UPDATE path_steps SET lat = 21.4225, lng = 39.8262 WHERE path_id = 'eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198' AND step_order = 1;
UPDATE path_steps SET lat = 20.5, lng = 39.2 WHERE path_id = 'eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198' AND step_order = 2;
UPDATE path_steps SET lat = 17.0, lng = 39.5 WHERE path_id = 'eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198' AND step_order = 3;
UPDATE path_steps SET lat = 15.3, lng = 39.0 WHERE path_id = 'eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198' AND step_order = 4;

-- Fix path step coordinates for "Journey to Ta'if" (f5e29c33-6058-424f-9d50-8512594f7974)
UPDATE path_steps SET lat = 21.4225, lng = 39.8262 WHERE path_id = 'f5e29c33-6058-424f-9d50-8512594f7974' AND step_order = 1;
UPDATE path_steps SET lat = 21.38, lng = 40.05 WHERE path_id = 'f5e29c33-6058-424f-9d50-8512594f7974' AND step_order = 2;
UPDATE path_steps SET lat = 21.30, lng = 40.35 WHERE path_id = 'f5e29c33-6058-424f-9d50-8512594f7974' AND step_order = 3;
UPDATE path_steps SET lat = 21.27, lng = 40.51 WHERE path_id = 'f5e29c33-6058-424f-9d50-8512594f7974' AND step_order = 4;

-- Fix path step coordinates for "The Hijrah" (8e28a39d-b5f3-48eb-8917-b4a2abb3e19d)
UPDATE path_steps SET lat = 21.4225, lng = 39.8262 WHERE path_id = '8e28a39d-b5f3-48eb-8917-b4a2abb3e19d' AND step_order = 1;
UPDATE path_steps SET lat = 21.38, lng = 39.85 WHERE path_id = '8e28a39d-b5f3-48eb-8917-b4a2abb3e19d' AND step_order = 2;
UPDATE path_steps SET lat = 22.45, lng = 39.62 WHERE path_id = '8e28a39d-b5f3-48eb-8917-b4a2abb3e19d' AND step_order = 3;
UPDATE path_steps SET lat = 24.4686, lng = 39.6142 WHERE path_id = '8e28a39d-b5f3-48eb-8917-b4a2abb3e19d' AND step_order = 4;

-- Link timeline events to their paths
UPDATE timeline_events SET path_id = 'eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198' WHERE id = '4f3e97c7-ea1d-491b-b6d4-1680f8bfcf89';
UPDATE timeline_events SET path_id = 'eb0d2f1e-a5f0-46ad-9fb6-6bb69f82c198' WHERE id = '825f1dbb-fc6f-4f8a-a9a6-27725109ceda';
UPDATE timeline_events SET path_id = 'f5e29c33-6058-424f-9d50-8512594f7974' WHERE id = 'fbee9198-728e-4505-b6a6-0b6721655f44';
UPDATE timeline_events SET path_id = 'f5e29c33-6058-424f-9d50-8512594f7974' WHERE id = 'd6b64ff9-9434-4738-9bb4-266423bdb1ac';
UPDATE timeline_events SET path_id = '8e28a39d-b5f3-48eb-8917-b4a2abb3e19d' WHERE id = '7fa52c10-89ef-4967-b4bb-33ca08130ea8';
UPDATE timeline_events SET path_id = '8e28a39d-b5f3-48eb-8917-b4a2abb3e19d' WHERE id = '2847eb15-85be-4895-b4dc-0d5fe7321a9e';
