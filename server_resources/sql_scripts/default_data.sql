USE messaging_web_app_db;
-- DEFAULT DATA
INSERT INTO users		SET id='0000-0000-0000-0000-0000', pseudo='nmaitre', email='nicolas.maitre@cpnv.ch', first_name='Nicolas', last_name='Maitre', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;
INSERT INTO users		SET id='1111-1111-1111-1111-1111', pseudo='nglassey', email='nicolas.glassey@cpnv.ch', first_name='Nicolas', last_name='Glassey', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;
INSERT INTO users		SET id='2222-2222-2222-2222-2222', pseudo='ggruaz', email='ggruaz@gmail.com', first_name='Gilbert', last_name='Gruaz', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;
INSERT INTO users		SET id='3333-3333-3333-3333-3333', pseudo='euloueu', email='contact@elouan-media.ch', first_name='Elouan', last_name='Reymond', creation_time=CURRENT_TIMESTAMP(), active=1, enabled=1;

-- friends
-- INSERT INTO friends		SET user_0="0000-0000-0000-0000-0000", user_1="1111-1111-1111-1111-1111", creation_time=CURRENT_TIMESTAMP(), active=1;

-- private
INSERT INTO `groups` 		SET id="0000-1111-2222-3333-4444", creation_time=CURRENT_TIMESTAMP(), name="Nicolas Maitre, Nicolas Glassey", type="private", active=1;
INSERT INTO user_groups SET user="0000-0000-0000-0000-0000",`group`="0000-1111-2222-3333-4444", creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups SET user="1111-1111-1111-1111-1111",`group`="0000-1111-2222-3333-4444", creation_time=CURRENT_TIMESTAMP(), active=1;
-- group
INSERT INTO `groups` 		SET id="5555-6666-7777-8888-9999", creation_time=CURRENT_TIMESTAMP(), name="Le groupe CPNV", type="group", active=1;
INSERT INTO user_groups SET user="0000-0000-0000-0000-0000",`group`="5555-6666-7777-8888-9999", creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups SET user="1111-1111-1111-1111-1111",`group`="5555-6666-7777-8888-9999", creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups SET user="2222-2222-2222-2222-2222",`group`="5555-6666-7777-8888-9999", creation_time=CURRENT_TIMESTAMP(), active=1;
INSERT INTO user_groups SET user="3333-3333-3333-3333-3333",`group`="5555-6666-7777-8888-9999", creation_time=CURRENT_TIMESTAMP(), active=1;

-- tokens
INSERT INTO tokens 		SET id=UUID(), value='1234-1234-1234-1234-1234', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='0000-0000-0000-0000-0000';
INSERT INTO tokens 		SET id=UUID(), value='2345-2345-2345-2345-2345', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='1111-1111-1111-1111-1111';
INSERT INTO tokens 		SET id=UUID(), value='3456-3456-3456-3456-3456', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='2222-2222-2222-2222-2222';
INSERT INTO tokens 		SET id=UUID(), value='4567-4567-4567-4567-4567', type='session', expiration_time=CURRENT_TIMESTAMP(), active=1, user='3333-3333-3333-3333-3333';

-- files
-- INSERT INTO files 		SET id="4321-5432-6543-7654-8765", type="image", subtype="image/png", location="1122-2233-3344-4455-5566", owner="0000-0000-0000-0000-0000", source_name="taron.png", creation_time=CURRENT_TIMESTAMP();