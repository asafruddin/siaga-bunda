-- Replace placeholder assessments while preserving questions referenced by
-- historical test answers.
alter table public.questions
drop constraint questions_display_order_check;

alter table public.questions
drop constraint questions_video_id_test_type_display_order_key;

alter table public.questions
add constraint questions_display_order_check
check (display_order between 1 and 25);

update public.questions
set is_active = false
where is_active;

create unique index questions_active_video_type_order_key
on public.questions (video_id, test_type, display_order)
where is_active;

create or replace function public.sync_assessment_questions()
returns void
language plpgsql
set search_path = ''
as $$
declare
  video record;
  pretest_count integer;
  posttest_count integer;
begin
with question_bank (
  test_type,
  sequence_number,
  display_order,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer
) as (
  values
    ('pretest'::public.test_kind, 1, 1, 'Apa yang dimaksud dengan kehamilan aman?', 'Kehamilan yang tidak perlu diperiksa selama ibu merasa sehat.', 'Kehamilan yang dipantau secara rutin agar ibu dan bayi tetap sehat sampai persalinan.', 'Kehamilan yang hanya membutuhkan vitamin.', 'Kehamilan yang tidak memerlukan dukungan keluarga.', 'b'),
    ('pretest'::public.test_kind, 1, 2, 'Mengapa ibu hamil perlu melakukan pemeriksaan kehamilan (ANC) secara rutin?', 'Agar dapat mengetahui jenis kelamin bayi lebih cepat.', 'Agar berat badan ibu selalu bertambah.', 'Agar masalah atau komplikasi kehamilan dapat diketahui lebih awal.', 'Agar ibu tidak perlu melahirkan di fasilitas kesehatan.', 'c'),
    ('pretest'::public.test_kind, 1, 3, 'Salah satu tujuan pelayanan kehamilan aman adalah...', 'Mengurangi waktu persalinan.', 'Menjaga kesehatan ibu dan janin selama kehamilan.', 'Menentukan jenis kelamin bayi.', 'Menghindari semua rasa tidak nyaman selama hamil.', 'b'),
    ('pretest'::public.test_kind, 1, 4, 'Siapa yang berperan penting dalam mendukung kehamilan agar tetap aman?', 'Hanya ibu hamil.', 'Hanya bidan.', 'Ibu, keluarga, dan tenaga kesehatan.', 'Tetangga saja.', 'c'),
    ('pretest'::public.test_kind, 1, 5, 'Berikut ini yang merupakan contoh dukungan keluarga selama kehamilan adalah...', 'Mengingatkan jadwal pemeriksaan kehamilan.', 'Melarang ibu memeriksakan kehamilan.', 'Membiarkan ibu mengurus semua sendiri.', 'Menyarankan ibu berhenti makan makanan bergizi.', 'a'),
    ('pretest'::public.test_kind, 2, 1, 'Trimester I kehamilan adalah masa kehamilan pada usia...', '0–12 minggu', '13–27 minggu', '28–40 minggu', '32–40 minggu', 'a'),
    ('pretest'::public.test_kind, 2, 2, 'Jika ibu hamil mengalami perdarahan dari jalan lahir pada trimester pertama, tindakan yang paling tepat adalah...', 'Menunggu sampai perdarahan berhenti sendiri.', 'Minum obat atau jamu agar perdarahan berhenti.', 'Segera memeriksakan diri ke fasilitas kesehatan.', 'Tetap melakukan aktivitas seperti biasa.', 'c'),
    ('pretest'::public.test_kind, 2, 3, 'Berikut ini yang termasuk tanda keguguran (abortus) adalah...', 'Perdarahan dari vagina disertai nyeri atau kram perut.', 'Nafsu makan meningkat.', 'Berat badan bertambah.', 'Gerakan janin semakin kuat.', 'a'),
    ('pretest'::public.test_kind, 2, 4, 'Mual dan muntah saat hamil perlu diwaspadai apabila...', 'Hanya terjadi pada pagi hari.', 'Terjadi sekali dalam sehari.', 'Ibu tidak dapat makan atau minum karena muntah terus-menerus.', 'Berkurang setelah istirahat.', 'c'),
    ('pretest'::public.test_kind, 2, 5, 'Kondisi mual dan muntah berat yang dapat menyebabkan dehidrasi pada ibu hamil disebut...', 'Hipertensi.', 'Hiperemesis gravidarum.', 'Anemia.', 'Preeklamsia.', 'b'),
    ('pretest'::public.test_kind, 3, 1, 'Ibu hamil trimester II dan III harus segera memeriksakan diri ke fasilitas kesehatan jika mengalami...', 'Nafsu makan bertambah', 'Perdarahan dari jalan lahir', 'Berat badan bertambah', 'Perut semakin membesar', 'b'),
    ('pretest'::public.test_kind, 3, 2, 'Bengkak pada wajah dan tangan yang muncul secara tiba-tiba dapat menjadi tanda...', 'Kehamilan normal', 'Bayi bertambah besar', 'Preeklamsia', 'Kurang tidur', 'c'),
    ('pretest'::public.test_kind, 3, 3, 'Sakit kepala saat hamil perlu diwaspadai apabila...', 'Hilang setelah istirahat', 'Sangat berat dan disertai pandangan kabur', 'Terjadi setelah bekerja', 'Muncul saat lapar', 'b'),
    ('pretest'::public.test_kind, 3, 4, 'Jika ibu hamil mengalami pandangan kabur atau melihat kilatan cahaya, tindakan yang paling tepat adalah...', 'Menunggu sampai besok', 'Mengurangi minum air', 'Segera memeriksakan diri ke fasilitas kesehatan', 'Tidur lebih lama', 'c'),
    ('pretest'::public.test_kind, 3, 5, 'Gerakan janin yang terasa jauh berkurang dibanding biasanya menunjukkan bahwa ibu harus...', 'Menunggu sampai bayi bergerak sendiri', 'Minum obat sendiri', 'Segera memeriksakan diri ke fasilitas kesehatan', 'Melakukan aktivitas berat', 'c'),
    ('pretest'::public.test_kind, 4, 1, 'Yang dimaksud dengan faktor risiko kehamilan adalah...', 'Kondisi yang pasti menyebabkan ibu mengalami komplikasi.', 'Kondisi yang dapat meningkatkan kemungkinan terjadinya masalah selama kehamilan.', 'Keluhan yang selalu dialami semua ibu hamil.', 'Penyakit yang hanya terjadi setelah melahirkan.', 'b'),
    ('pretest'::public.test_kind, 4, 2, 'Kehamilan memiliki risiko lebih tinggi apabila terjadi pada usia...', '20–35 tahun.', '22–30 tahun.', 'Kurang dari 20 tahun atau lebih dari 35 tahun.', '25–30 tahun.', 'c'),
    ('pretest'::public.test_kind, 4, 3, 'Jarak kehamilan yang terlalu dekat adalah apabila ibu hamil kembali dalam waktu...', 'Kurang dari 2 tahun setelah persalinan sebelumnya.', 'Lebih dari 5 tahun setelah persalinan.', 'Tepat 3 tahun setelah persalinan.', 'Lebih dari 10 tahun setelah persalinan.', 'a'),
    ('pretest'::public.test_kind, 4, 4, 'Mengapa tekanan darah ibu hamil perlu diperiksa secara rutin?', 'Untuk mengetahui jenis kelamin bayi.', 'Untuk mendeteksi risiko tekanan darah tinggi dan komplikasi kehamilan.', 'Agar berat badan ibu cepat bertambah.', 'Untuk menentukan tanggal persalinan.', 'b'),
    ('pretest'::public.test_kind, 4, 5, 'Ibu hamil yang memiliki diabetes memerlukan...', 'Pemeriksaan gula darah dan kontrol kehamilan yang lebih teratur.', 'Berhenti memeriksakan kehamilan.', 'Mengurangi minum air putih.', 'Tidak perlu memberi tahu tenaga kesehatan.', 'a'),
    ('pretest'::public.test_kind, 5, 1, 'Jika ibu hamil mengalami perdarahan dari jalan lahir, tindakan yang paling tepat adalah...', 'Menunggu sampai perdarahan berhenti sendiri.', 'Minum jamu agar darah berhenti.', 'Segera pergi ke fasilitas kesehatan.', 'Tetap beraktivitas seperti biasa.', 'c'),
    ('pretest'::public.test_kind, 5, 2, 'Ibu hamil yang mengalami kejang harus segera...', 'Diberi makan dan minum.', 'Dibawa ke rumah sakit atau fasilitas kesehatan.', 'Dipijat agar cepat sadar.', 'Dimasukkan sendok ke dalam mulutnya.', 'b'),
    ('pretest'::public.test_kind, 5, 3, 'Berikut ini merupakan tanda ketuban pecah sebelum persalinan, yaitu...', 'Keluar cairan terus-menerus yang tidak dapat ditahan.', 'Keluar lendir saat batuk.', 'Nyeri punggung setelah bekerja.', 'Sering buang air kecil.', 'a'),
    ('pretest'::public.test_kind, 5, 4, 'Jika gerakan janin terasa jauh berkurang dibanding biasanya, ibu sebaiknya...', 'Menunggu sampai bayi bergerak kembali.', 'Tidur lebih lama.', 'Segera memeriksakan diri ke fasilitas kesehatan.', 'Minum obat sendiri.', 'c'),
    ('pretest'::public.test_kind, 5, 5, 'Keluhan berikut yang masih dapat menunggu kontrol kehamilan sesuai jadwal adalah...', 'Mual ringan.', 'Perdarahan dari jalan lahir.', 'Kejang.', 'Sesak napas berat.', 'a'),
    ('pretest'::public.test_kind, 6, 1, 'Salah satu cara terbaik untuk mencegah komplikasi selama kehamilan adalah...', 'Memeriksakan kehamilan secara rutin.', 'Beristirahat hanya jika merasa sakit.', 'Minum obat tanpa berkonsultasi.', 'Menunggu sampai muncul keluhan.', 'a'),
    ('pretest'::public.test_kind, 6, 2, 'Apa tujuan utama pemeriksaan kehamilan (ANC)?', 'Menentukan jenis kelamin bayi.', 'Memantau kesehatan ibu dan janin selama kehamilan.', 'Mempercepat proses persalinan.', 'Menambah berat badan ibu.', 'b'),
    ('pretest'::public.test_kind, 6, 3, 'Menurut anjuran Kementerian Kesehatan, ibu hamil dianjurkan mengonsumsi minimal ... tablet tambah darah (Fe) selama kehamilan.', '30 tablet.', '60 tablet.', '90 tablet.', '120 tablet.', 'c'),
    ('pretest'::public.test_kind, 6, 4, 'Salah satu manfaat mengonsumsi tablet tambah darah (Fe) selama kehamilan adalah...', 'Menambah tinggi badan ibu.', 'Mencegah anemia selama kehamilan.', 'Membuat bayi lahir lebih cepat.', 'Mengurangi gerakan janin.', 'b'),
    ('pretest'::public.test_kind, 6, 5, 'Berikut ini yang termasuk makanan bergizi seimbang untuk ibu hamil adalah...', 'Nasi, ikan, sayur, buah, dan air putih.', 'Makanan cepat saji setiap hari.', 'Minuman manis saja.', 'Kerupuk dan mi instan setiap hari.', 'a'),
    ('pretest'::public.test_kind, 7, 1, 'Apa yang sebaiknya dilakukan ibu hamil jika merasakan keluhan yang tidak biasa selama kehamilan?', 'Menunggu sampai keluhan hilang sendiri.', 'Segera memeriksakan diri ke tenaga kesehatan.', 'Meminum jamu tanpa berkonsultasi.', 'Mengabaikan keluhan tersebut.', 'b'),
    ('pretest'::public.test_kind, 7, 2, 'Berikut ini yang merupakan tanda bahaya kehamilan adalah...', 'Mual ringan pada pagi hari.', 'Pegal setelah beraktivitas.', 'Perdarahan dari jalan lahir.', 'Mudah mengantuk.', 'c'),
    ('pretest'::public.test_kind, 7, 3, 'Jika gerakan bayi dalam kandungan berkurang dibanding biasanya, ibu hamil sebaiknya...', 'Menunggu hingga bayi bergerak kembali.', 'Minum air manis saja.', 'Segera memeriksakan diri ke fasilitas kesehatan.', 'Beristirahat selama satu hari.', 'c'),
    ('pretest'::public.test_kind, 7, 4, 'Pernyataan berikut yang benar mengenai mitos selama kehamilan adalah...', 'Memijat perut dapat memperbaiki posisi bayi.', 'Minum jamu dapat menghentikan perdarahan saat hamil.', 'Informasi tentang kehamilan sebaiknya diperoleh dari tenaga kesehatan.', 'Bayi yang jarang bergerak pasti akan aktif kembali tanpa perlu diperiksa.', 'c'),
    ('pretest'::public.test_kind, 7, 5, 'Salah satu bentuk dukungan suami dan keluarga selama kehamilan adalah...', 'Mengingatkan jadwal pemeriksaan kehamilan.', 'Melarang ibu memeriksakan kehamilan.', 'Membiarkan ibu menghadapi semua masalah sendiri.', 'Menyarankan ibu berhenti minum tablet tambah darah.', 'a'),
    ('posttest'::public.test_kind, null, 1, 'Tujuan utama pemeriksaan kehamilan (ANC) adalah....', 'Menentukan jenis kelamin bayi', 'Memantau kesehatan ibu dan janin', 'Menentukan tanggal persalinan', 'Mengurangi berat badan ibu', 'b'),
    ('posttest'::public.test_kind, null, 2, 'WHO saat ini menganjurkan ibu hamil melakukan minimal .... kali kontak ANC selama kehamilan.', '4 kali', '6 kali', '8 kali', '10 kali', 'c'),
    ('posttest'::public.test_kind, null, 3, 'Perdarahan dari jalan lahir saat hamil merupakan....', 'Keluhan yang selalu normal', 'Tanda bahaya yang perlu segera diperiksa', 'Tanda bayi berkembang baik', 'Hal yang dapat diobati sendiri di rumah', 'b'),
    ('posttest'::public.test_kind, null, 4, 'Mual dan muntah pada ibu hamil menjadi berbahaya apabila....', 'Hanya terjadi pagi hari', 'Terjadi satu kali sehari', 'Ibu tidak dapat makan dan minum karena muntah terus-menerus', 'Berkurang setelah makan', 'c'),
    ('posttest'::public.test_kind, null, 5, 'Nyeri perut yang perlu segera diperiksa adalah nyeri yang....', 'Ringan dan hilang sendiri', 'Sangat hebat atau disertai perdarahan', 'Terjadi setelah makan', 'Muncul saat duduk lama', 'b'),
    ('posttest'::public.test_kind, null, 6, 'Salah satu tanda bahaya pada trimester II dan III adalah....', 'Nafsu makan meningkat', 'Pandangan kabur', 'Mudah mengantuk', 'Pegal ringan', 'b'),
    ('posttest'::public.test_kind, null, 7, 'Gerakan janin yang berkurang dibanding biasanya menunjukkan bahwa ibu harus....', 'Menunggu satu hari', 'Minum obat', 'Segera ke fasilitas kesehatan', 'Berjalan kaki lebih lama', 'c'),
    ('posttest'::public.test_kind, null, 8, 'Ketuban pecah sebelum waktunya ditandai dengan....', 'Keluar darah sedikit', 'Keluar cairan terus-menerus yang sulit ditahan', 'Nyeri pinggang', 'Perut terasa gatal', 'b'),
    ('posttest'::public.test_kind, null, 9, 'Bengkak mendadak pada wajah dan tangan dapat menjadi tanda....', 'Kurang tidur', 'Preeklamsia', 'Bayi sehat', 'Berat badan bertambah', 'b'),
    ('posttest'::public.test_kind, null, 10, 'Kehamilan yang memiliki risiko lebih tinggi terjadi pada usia....', '20–35 tahun', '25–30 tahun', 'Kurang dari 20 tahun atau lebih dari 35 tahun', '22–32 tahun', 'c'),
    ('posttest'::public.test_kind, null, 11, 'Jarak kehamilan yang dianjurkan minimal setelah persalinan adalah....', '6 bulan', '12 bulan', '24 bulan', '36 bulan', 'c'),
    ('posttest'::public.test_kind, null, 12, 'Ibu dengan riwayat tekanan darah tinggi memerlukan....', 'Pemeriksaan tekanan darah secara rutin', 'Mengurangi minum air', 'Berhenti kontrol kehamilan', 'Minum jamu', 'a'),
    ('posttest'::public.test_kind, null, 13, 'Salah satu manfaat tablet tambah darah adalah....', 'Menambah tinggi badan', 'Mencegah anemia', 'Menentukan jenis kelamin bayi', 'Mengurangi gerakan janin', 'b'),
    ('posttest'::public.test_kind, null, 14, 'Makanan bergizi seimbang bagi ibu hamil sebaiknya mengandung....', 'Karbohidrat, protein, vitamin, mineral, dan air', 'Minuman manis saja', 'Makanan cepat saji setiap hari', 'Camilan saja', 'a'),
    ('posttest'::public.test_kind, null, 15, 'Apabila ibu hamil mengalami kejang, tindakan yang benar adalah....', 'Memasukkan sendok ke mulut ibu', 'Menahan gerakan kejang', 'Segera membawa ibu ke rumah sakit', 'Memberikan makanan', 'c'),
    ('posttest'::public.test_kind, null, 16, 'Saat mengalami tanda bahaya kehamilan, ibu sebaiknya....', 'Mengonsumsi jamu', 'Menunggu hingga besok', 'Segera mencari pertolongan tenaga kesehatan', 'Memijat perut', 'c'),
    ('posttest'::public.test_kind, null, 17, 'Dokumen yang sebaiknya dibawa ketika menuju fasilitas kesehatan adalah....', 'Buku KIA', 'Buku tabungan', 'Buku resep', 'Buku pelajaran', 'a'),
    ('posttest'::public.test_kind, null, 18, 'Salah satu tindakan yang tidak boleh dilakukan saat ibu mengalami perdarahan adalah....', 'Menggunakan pembalut', 'Segera ke rumah sakit', 'Memijat perut', 'Menghubungi tenaga kesehatan', 'c'),
    ('posttest'::public.test_kind, null, 19, 'Suami dan keluarga dapat membantu menjaga kesehatan ibu hamil dengan cara....', 'Mengingatkan jadwal ANC', 'Melarang kontrol', 'Menghentikan tablet Fe', 'Menunda pemeriksaan', 'a'),
    ('posttest'::public.test_kind, null, 20, 'Salah satu manfaat imunisasi selama kehamilan adalah....', 'Melindungi ibu dan bayi dari penyakit tertentu', 'Mempercepat persalinan', 'Mengurangi kebutuhan makan', 'Menentukan berat bayi', 'a'),
    ('posttest'::public.test_kind, null, 21, 'Apabila ibu hamil mengalami sesak napas berat saat istirahat, tindakan yang tepat adalah....', 'Menunggu hingga malam', 'Segera memeriksakan diri ke fasilitas kesehatan', 'Minum jamu', 'Tidur sepanjang hari', 'b'),
    ('posttest'::public.test_kind, null, 22, 'Mengapa ibu hamil perlu mempersiapkan persalinan sejak awal?', 'Agar lebih siap jika terjadi keadaan darurat', 'Agar bayi lahir lebih cepat', 'Agar tidak perlu ANC', 'Agar bisa memilih tanggal lahir', 'a'),
    ('posttest'::public.test_kind, null, 23, 'Apabila mendengar informasi tentang kehamilan dari media sosial, ibu sebaiknya....', 'Langsung mengikuti', 'Memastikan kebenarannya kepada tenaga kesehatan', 'Membagikannya kepada orang lain', 'Mengabaikan pemeriksaan kehamilan', 'b'),
    ('posttest'::public.test_kind, null, 24, 'Ibu hamil yang cerdas adalah ibu yang....', 'Mengetahui semua hal tentang kehamilan', 'Mampu mengambil keputusan yang tepat saat muncul masalah', 'Tidak pernah bertanya kepada bidan', 'Selalu mengikuti mitos', 'b'),
    ('posttest'::public.test_kind, null, 25, 'Pernyataan berikut yang PALING benar mengenai kehamilan sehat adalah....', 'Kehamilan sehat berarti ibu tidak pernah mengalami keluhan.', 'Kehamilan sehat berarti ibu mengetahui kapan harus segera mencari pertolongan jika muncul tanda bahaya.', 'Kehamilan sehat cukup dengan makan banyak.', 'Kehamilan sehat tidak memerlukan pemeriksaan kehamilan.', 'b')
)
insert into public.questions (
  video_id,
  test_type,
  display_order,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer
)
select
  videos.id,
  question_bank.test_type,
  question_bank.display_order,
  question_bank.question_text,
  question_bank.option_a,
  question_bank.option_b,
  question_bank.option_c,
  question_bank.option_d,
  question_bank.correct_answer
from public.videos
join question_bank
  on question_bank.sequence_number is null
  or question_bank.sequence_number = videos.sequence_number
on conflict (video_id, test_type, display_order) where is_active
do update set
  question_text = excluded.question_text,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  option_d = excluded.option_d,
  correct_answer = excluded.correct_answer;

  for video in select id, sequence_number from public.videos loop
    select count(*) into pretest_count
    from public.questions
    where video_id = video.id
      and test_type = 'pretest'
      and is_active;

    select count(*) into posttest_count
    from public.questions
    where video_id = video.id
      and test_type = 'posttest'
      and is_active;

    if pretest_count <> 5 or posttest_count <> 25 then
      raise exception
        'Invalid assessment question counts for video %: pretest %, posttest %',
        video.sequence_number,
        pretest_count,
        posttest_count;
    end if;

    if exists (
      select expected.display_order
      from generate_series(1, 5) as expected(display_order)
      except
      select display_order
      from public.questions
      where video_id = video.id
        and test_type = 'pretest'
        and is_active
    ) or exists (
      select expected.display_order
      from generate_series(1, 25) as expected(display_order)
      except
      select display_order
      from public.questions
      where video_id = video.id
        and test_type = 'posttest'
        and is_active
    ) then
      raise exception
        'Assessment question order is incomplete for video %',
        video.sequence_number;
    end if;
  end loop;
end $$;

revoke all on function public.sync_assessment_questions() from public;
revoke all on function public.sync_assessment_questions() from anon;
revoke all on function public.sync_assessment_questions() from authenticated;

select public.sync_assessment_questions();
