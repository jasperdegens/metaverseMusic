for %%f in (./vocals/*.wav) do ffmpeg -i "./vocals/%%f" -af "loudnorm=I=-16:LRA=11:TP=-1.5" "./vocalsNormalized/%%~nf.mp3"
timeout 10