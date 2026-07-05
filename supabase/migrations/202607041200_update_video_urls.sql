-- Update video URLs, titles, and durations to Cloudinary sources.
update public.videos
set
  title = 'Pertemuan 1',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783131751/PERTEMUAN_1_FIX_eir43s.mp4',
  duration_seconds = 1156
where sequence_number = 1;

update public.videos
set
  title = 'Pertemuan 2',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132062/PERTEMUAN_2_FIX_sfuj9i.mp4',
  duration_seconds = 484
where sequence_number = 2;

update public.videos
set
  title = 'Pertemuan 3',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132009/PERTEMUAN_3_FIX_baqims.mp4',
  duration_seconds = 827
where sequence_number = 3;

update public.videos
set
  title = 'Pertemuan 4',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132427/PERTEMUAN_4_FIX_to8xeq.mp4',
  duration_seconds = 357
where sequence_number = 4;

update public.videos
set
  title = 'Pertemuan 5',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132570/PERTEMUAN_5_FIX_lqymis.mp4',
  duration_seconds = 507
where sequence_number = 5;

update public.videos
set
  title = 'Pertemuan 6',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132640/PERTEMUAN_6_FIX_mzhnbw.mp4',
  duration_seconds = 234
where sequence_number = 6;

update public.videos
set
  title = 'Pertemuan 7',
  video_url = 'https://res.cloudinary.com/b6x2xk5r/video/upload/v1783132710/PERTEMUAN_7_FIX_zqvk1b.mp4',
  duration_seconds = 476
where sequence_number = 7;
