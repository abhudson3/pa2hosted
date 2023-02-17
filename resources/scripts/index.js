let authToken = "";
let songs = []

let renderSongs = function () {
  //   let html = `<div class="row">`;
  document.getElementById("cards-row").innerHTML = "";

  songs.forEach(async function (song) {
    if (song.deleted != true) {
      let trackId =  await trackFinder(`${song.title}`, `${song.artist}`);
      var favorited = "";
      if (song.favorited == true) {
        favorited = "💚";
      } else {
        favorited = "♡";
      }
      const songItem = document.createElement("div");
      songItem.id = `song-${trackId}`;
      songItem.className = "card m-4";
      songItem.style = "width: 18rem;";
      songItem.innerHTML = ` <div class="card-body">
                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

                        <h5 class="card-title">Title: ${song.title}</h5>
                        <p class="card-text">Artist: ${song.artist}</p>
                        <p class="card-text">Date Added: ${song.dateAdded}</p>
                        <p onclick="favoriteSong('${song.songId}')" id="favoriteButton" class="btn btn-outline-success">${favorited}</p>
                        <p onclick="deleteSong('${song.songId}')" id="deleteButton"  class="btn btn-outline-danger">🗑️</p>
                    </div>`;
      document.getElementById("cards-row").appendChild(songItem);
    }
  });

  localStorage.setItem("allSongs", JSON.stringify(songs));
};

function handleOnLoad() {
  if (JSON.parse(localStorage.getItem("allSongs")) != null) {
    try {
      songs = JSON.parse(localStorage.getItem("allSongs"));
    } catch {}
  }

  renderSongs();
}



document.querySelector("#new-songs").addEventListener("submit", function (e) {
  e.preventDefault(); //prevents page refresh
  let guid = generateGUID();
  var date = new Date();

  songs.unshift({
    title: e.target.elements.title.value,
    artist: e.target.elements.artist.value,
    dateAdded: date.toLocaleDateString("en-us"),
    songId: guid,
    favorited: false,
    deleted: false,
  });
  blankFields();
  renderSongs(songs);
});

function generateGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


function deleteSong(song) {
  for (var i = 0; i < songs.length; i++) {
    if (songs[i].songId == song) {
      songs[i].deleted = true;
    }
  }
  renderSongs(songs);
}
function favoriteSong(song) {
  for (var i = 0; i < songs.length; i++) {
    if (songs[i].songId == song) {
      songs[i].favorited = !songs[i].favorited;
    }
  }
  renderSongs(songs);
}

function blankFields() {
  document.getElementById("title").value = "";
  document.getElementById("artist").value = "";
}


async function trackFinder(title, artist) {
  let baseUrl = "https://api.spotify.com/v1/search";
  title = title.replace(/ /g, "%20");
  artist = artist.replace(/ /g, "%20");

  const responseBody = await fetch(
    baseUrl + "?q=" + title + "%20" + artist + "&type=track",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer BQDcm2KX6mIVJLgcHVtvYGX33j455-69KtaIUzstCRhdKF47uzVAQ74psriKLLETTWeYMmPHpcm6pe_40av3_bVp9nnd6q3iUylyy6hFbnZOeoXj0TWZbvleP5uSRADZ7kWMcqdhFNcYdRXXiSM3HKWbZ1V-qK5VO6kfn-_uU5lweZT2mQ
          `,
        Accept: "application/json",
      },
    }
  ).then((res) => res.json());

  return responseBody.tracks.items[0].id;
}

// async function getToken() {
//     const clientId = "9b0b8c0e80fd4249b002d0306243586f";
//     const clientSecret = "02a823d35f464bdd89c681e5b4ab61ae";
//     const auth = btoa(`${clientId}:${clientSecret}`);
//     url = "https://accounts.spotify.com/api/token"
//     const responseBody = await fetch(
//       url,
//       {
//         method: "POST",
//         headers: {
//             Authorization: `Basic ${auth}`,
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: "grant_type=client_credentials",
//       }
//       ).then((res) => res.json())
  
//     return responseBody;
// }

