// Load the local guide before wiring up the room's chat form.
import('/profile-chat.js').then(({ answerProfileQuestion }) => {
  window.burakAnswer = answerProfileQuestion;
  return import('/music-player.js').then(({ mountPlaylist }) => {
    mountPlaylist();
    return import('/_astro/index.astro_astro_type_script_index_0_lang.B77HpVjE.js');
  });
}).catch(error => {
  console.error('Çalışma odası açılamadı:', error);
  document.documentElement.classList.add('flat');
  document.documentElement.classList.remove('room-preparing');
  document.getElementById('loader')?.classList.add('done');
  document.querySelectorAll('.surface').forEach(el => { el.hidden = false; });
});
