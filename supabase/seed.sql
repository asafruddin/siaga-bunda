insert into public.videos(sequence_number,title,description,video_url,duration_seconds) values
(1,'Pertemuan 1','Kenali perdarahan yang membutuhkan pertolongan segera.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783131751/PERTEMUAN_1_FIX_eir43s.mp4',1156),
(2,'Pertemuan 2','Waspadai tanda preeklamsia.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132062/PERTEMUAN_2_FIX_sfuj9i.mp4',484),
(3,'Pertemuan 3','Bedakan bengkak normal dan tanda bahaya.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132009/PERTEMUAN_3_FIX_baqims.mp4',827),
(4,'Pertemuan 4','Kenali demam dan infeksi selama kehamilan.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132427/PERTEMUAN_4_FIX_to8xeq.mp4',357),
(5,'Pertemuan 5','Cara memantau gerakan janin dengan benar.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132570/PERTEMUAN_5_FIX_lqymis.mp4',507),
(6,'Pertemuan 6','Tindakan aman saat cairan ketuban keluar.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132640/PERTEMUAN_6_FIX_mzhnbw.mp4',234),
(7,'Pertemuan 7','Kenali kondisi gawat darurat kehamilan.','https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132710/PERTEMUAN_7_FIX_zqvk1b.mp4',476)
on conflict(sequence_number) do update set title=excluded.title,description=excluded.description,video_url=excluded.video_url,duration_seconds=excluded.duration_seconds;

do $$
declare v record; kind test_kind; i int; topics text[] := array['perdarahan','sakit kepala berat','bengkak tidak wajar','demam tinggi','gerakan janin berkurang','ketuban pecah','nyeri hebat atau kejang'];
begin
 for v in select * from public.videos loop
  foreach kind in array array['pretest'::test_kind,'posttest'::test_kind] loop
   for i in 1..10 loop
    insert into public.questions(video_id,test_type,display_order,question_text,option_a,option_b,option_c,option_d,correct_answer)
    values(v.id,kind,i,
      case i
       when 1 then 'Apa tindakan paling tepat bila mengalami '||topics[v.sequence_number]||' saat hamil?'
       when 2 then 'Kapan ibu hamil perlu mencari pertolongan untuk tanda tersebut?'
       when 3 then 'Siapa yang sebaiknya dihubungi saat muncul tanda bahaya?'
       when 4 then 'Apa yang perlu dipersiapkan menuju fasilitas kesehatan?'
       when 5 then 'Apakah tanda bahaya boleh ditangani sendiri di rumah?'
       when 6 then 'Mengapa pemeriksaan segera penting bagi ibu dan bayi?'
       when 7 then 'Apa peran keluarga saat tanda bahaya muncul?'
       when 8 then 'Ke mana ibu sebaiknya pergi saat kondisi memburuk?'
       when 9 then 'Apa yang perlu disampaikan kepada tenaga kesehatan?'
       else 'Apa prinsip utama menghadapi tanda bahaya kehamilan?' end,
      case when i in (3,7) then 'Mendampingi dan menghubungi tenaga kesehatan' else 'Segera hubungi tenaga kesehatan' end,
      'Menunggu beberapa hari tanpa berkonsultasi','Minum obat bebas tanpa anjuran','Mengabaikannya bila masih dapat beraktivitas','a')
    on conflict(video_id,test_type,display_order) do nothing;
   end loop;
  end loop;
 end loop;
end $$;

-- Create a researcher through Supabase Authentication first, then link it:
-- insert into public.users(auth_user_id,role,email) values ('AUTH_USER_UUID','researcher','researcher@example.com');
