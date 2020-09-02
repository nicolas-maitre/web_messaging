-- SELECT * FROM users INNER JOIN groups INNER JOIN user_groups on user_groups.`group` = groups.id WHERE users.id != user_groups.user AND groups.`type` != "private" AND user_groups.user = "0000-0000-0000-0000-0000";
-- SELECT * FROM users INNER JOIN user_groups on users.id = user_groups.user INNER JOIN groups on groups.id = user_groups.`group` WHERE groups.`type` = "private" AND users.id = "0000-0000-0000-0000-0000" OR users.id = "1111-1111-1111-1111-1111" GROUP BY groups.id
-- SELECT COUNT(groups.id) FROM groups INNER JOIN user_groups on user_groups.`group` = groups.id INNER JOIN user_groups  WHERE groups.`type` = "private"
SELECT * FROM user_groups INNER JOIN (SELECT groups.id FROM user_groups INNER JOIN groups on user_groups.`group` = groups.id WHERE user_groups.user ="0000-0000-0000-0000-0000" AND groups.type = "private") AS groupsList on user_groups.group = groupsList.id AND user_groups.user != "0000-0000-0000-0000-0000";

SELECT * FROM users_has_workinggroups INNER JOIN (SELECT workinggroups_idworkinggroups AS idWG FROM workinggroups_has_events WHERE events_idevents = "1") AS listWG on listWG.idWG = users_has_workinggroups.workinggroups_idworkinggroups WHERE users_has_workinggroups.users_idusers = "2";

SELECT * FROM users_has_workinggroups INNER JOIN workinggroups_has_events on workinggroups_has_events.workinggroups_idworkinggroups = users_has_workinggroups.workinggroups_idworkinggroups WHERE users_has_workinggroups.users_idusers = "2";

SELECT * FROM users_has_workinggroups 
INNER JOIN workinggroups_has_events on workinggroups_has_events.workinggroups_idworkinggroups = users_has_workinggroups.workinggroups_idworkinggroups 
INNER JOIN events on events.idevents = workinggroups_has_events.events_idevents
WHERE users_has_workinggroups.users_idusers = "2";