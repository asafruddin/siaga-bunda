insert into public.videos(sequence_number,title,description,video_url,duration_seconds) values
(1,'Pertemuan 1','Kenali perdarahan yang membutuhkan pertolongan segera.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783131751/PERTEMUAN_1_FIX_eir43s.mp4',1156),
(2,'Pertemuan 2','Waspadai tanda preeklamsia.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132062/PERTEMUAN_2_FIX_sfuj9i.mp4',484),
(3,'Pertemuan 3','Bedakan bengkak normal dan tanda bahaya.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132009/PERTEMUAN_3_FIX_baqims.mp4',827),
(4,'Pertemuan 4','Kenali demam dan infeksi selama kehamilan.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132427/PERTEMUAN_4_FIX_to8xeq.mp4',357),
(5,'Pertemuan 5','Cara memantau gerakan janin dengan benar.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132570/PERTEMUAN_5_FIX_lqymis.mp4',507),
(6,'Pertemuan 6','Tindakan aman saat cairan ketuban keluar.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132640/PERTEMUAN_6_FIX_mzhnbw.mp4',234),
(7,'Pertemuan 7','Kenali kondisi gawat darurat kehamilan.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132710/PERTEMUAN_7_FIX_zqvk1b.mp4',476)
on conflict(sequence_number) do update set title=excluded.title,description=excluded.description,video_url=excluded.video_url,duration_seconds=excluded.duration_seconds;

-- The question bank is defined by the assessment migration so production and
-- newly seeded environments use exactly the same content.
select public.sync_assessment_questions();

-- Create a researcher through Supabase Authentication first, then link it:
-- insert into public.users(auth_user_id,role,email) values ('AUTH_USER_UUID','researcher','researcher@example.com');
