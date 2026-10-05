-- Die vier Start-Themes (THM-1). Design-Tokens, Assets und Kartenstile folgen in #12/#13.
INSERT INTO "themes" ("key", "name") VALUES
  ('knights', 'Ritter'),
  ('dinos', 'Dinos'),
  ('pirates', 'Piraten'),
  ('space', 'Weltraum')
ON CONFLICT ("key") DO NOTHING;
