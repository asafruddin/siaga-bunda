insert into public.videos(sequence_number,title,description,video_url,duration_seconds) values
(1,'Perdarahan pada Kehamilan','Kenali perdarahan yang membutuhkan pertolongan segera.','https://storage.example.com/videos/01-perdarahan.mp4',300),
(2,'Sakit Kepala dan Penglihatan Kabur','Waspadai tanda preeklamsia.','https://storage.example.com/videos/02-preeklamsia.mp4',300),
(3,'Bengkak pada Wajah dan Tangan','Bedakan bengkak normal dan tanda bahaya.','https://storage.example.com/videos/03-bengkak.mp4',300),
(4,'Demam Tinggi dan Infeksi','Kenali demam dan infeksi selama kehamilan.','https://storage.example.com/videos/04-demam.mp4',300),
(5,'Gerakan Janin Berkurang','Cara memantau gerakan janin dengan benar.','https://storage.example.com/videos/05-gerakan-janin.mp4',300),
(6,'Ketuban Pecah Dini','Tindakan aman saat cairan ketuban keluar.','https://storage.example.com/videos/06-ketuban.mp4',300),
(7,'Nyeri Perut dan Kejang','Kenali kondisi gawat darurat kehamilan.','https://storage.example.com/videos/07-nyeri-kejang.mp4',300)
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
