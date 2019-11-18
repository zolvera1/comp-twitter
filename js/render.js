$(function() {
  renderSite();
})
const renderSite = () => {
  renderRecent();
  $("#tweet-btn").on("click", tweetSubmitHandler);
  $(document).on("click", ".button.is-info", handleEditHandler);
  $(document).on("click", ".button.save", handleSaveHandler);
  $(document).on("click", ".trash-c", deleteHandler);
  $(document).on("click", ".like-i", likeHandler);
  $(document).on('click', '.reply-i',replyTweet);
  $(document).on('click', '.button.reply', submitReplyHandler);
  $(document).on('click','.retweet-i',retweet);
  $(document).on('click', 'button.retweet', retweetHandler)
};

const renderRecent = async () => {
  
  
  const tweets = await axios({
    method: "get",
    url: "https://comp426fa19.cs.unc.edu/a09/tweets",
    withCredentials: true
  });

  for (let index = 0; index < 50; index++) {
    let html = "";
    if (tweets.data[index]["isMine"]) {
      html = `
<article class="media">
    <figure class="media-left">
    <p class="image is-64x64">
      <img src="https://www.logolynx.com/images/logolynx/45/454490436454b599bffb8297bbaee099.jpeg">
    </p>
    </figure>
    <div class="media-content">
        <div id=${tweets.data[index].id} class="content">
            <p> 
                <strong>${
                  tweets.data[index].author
                } </strong> <small>Created at: ${new Date(
        tweets.data[index].createdAt
      )}</small>
                <br>
                <span class='tweet-bod'>${tweets.data[index].body}<span>
            </p>
        </div>
    <nav class="level is-mobile">
        <div class="level-left">
            <a class="level-item">
                <span class="icon"><i id="${
                  tweets.data[index].id
                }" class="fas fa-reply"></i>${
        tweets.data[index].replyCount
      }</span>
            </a>
            
            <a class="level-item">
                <span class="icon"><i id="${
                  tweets.data[index].id
                }" class="fas fa-retweet"></i>${
        tweets.data[index].retweetCount
      }</span>
            </a>
            <a class="level-item">
                <span data-liked=${tweets.data[index].isLiked} id="${
        tweets.data[index].id
      }" class="icon like-i"><i class="fas fa-thumbs-up"></i>${
        tweets.data[index].likeCount
      }</span>
            </a>
              <a class="level-item">
              <span 
              id="${tweets.data[index].id}" 
              class='icon trash-c'>
              <i class="fas fa-trash">
              </i>
              </span>
            </a>
            <div class= "level-item">
                <button 
                id="${tweets.data[index].id}" 
                class="button is-info is-light is-rounded is-small" 
                class="edit-btn">
                 Edit! 
                </button>
            </div>
        </div>
    </nav>
    </div>
</article>
`;
      $(".tweet-container").append(html);
    } else {
      html = `
<article class="media">
    <figure class="media-left">
    <p class="image is-64x64">
      <img src="https://www.logolynx.com/images/logolynx/45/454490436454b599bffb8297bbaee099.jpeg">
    </p>
    </figure>
    <div class="media-content">
        <div id=${tweets.data[index].id} class="content">
            <p> 
                <strong>${
                  tweets.data[index].author
                } </strong> <small>Created at: ${new Date(
        tweets.data[index].createdAt
      )}</small>
                <br>
                ${tweets.data[index].body}
            </p>
        </div>
    <nav class="level is-mobile">
        <div class="level-left">
            <a class="level-item">
                <span id="${tweets.data[index].id}" 
                class="icon reply-i">
                <i class="fas fa-reply">
                </i>
                ${tweets.data[index].replyCount}
                </span>
            </a>
            <a class="level-item">
              <span id="${tweets.data[index].id}" 
              class="icon retweet-i">
              <i class="fas fa-retweet">
              </i>
              ${tweets.data[index].retweetCount}
              </span>
            </a>
            <a class="level-item">
                <span data-liked=${tweets.data[index].isLiked} id="${
        tweets.data[index].id
      }" class="icon like-i">
                <i class="fas fa-thumbs-up"></i>${
                  tweets.data[index].likeCount
                }</span>
            </a>
        </div>
    </nav>
    </div>
</article>
        `;
      $(".tweet-container").append(html);
    }
  }
};

const tweetSubmitHandler = async e => {
  e.preventDefault();
  let tweet = $("#post-tweet").val();
  const result = await axios({
    method: "post",
    url: "https://comp426fa19.cs.unc.edu/a09/tweets",
    withCredentials: true,
    data: {
      type: "tweet",
      body: tweet
    }
  })
    .then(response => {
      console.log(response);
      location.reload();
    })
    .catch(response => {
      console.log(response);
    });
};
const handleSaveHandler = async e => {
  e.preventDefault();
  console.log(e.target.id);
  let id = e.target.id;
  let url = "https://comp426fa19.cs.unc.edu/a09/tweets/" + id;
  let string = $(`textarea[id=edit-text]`).val();
  console.log(string);
  const result = await axios({
    method: "put",
    url: url,
    withCredentials: true,
    data: {
      body: string
    }
  })
    .then(response => {
      console.log(response);
      
      location.reload();
    })
    .catch(response => {
      console.log(response);
    });
};
const handleEditHandler = e => {
  console.log(e.target.id);
  $(`div[id=${e.target.id}]`).replaceWith(`
<div class="field">
<div class="control">
  <textarea id='edit-text'
    class="textarea is-info is-small"
    placeholder="Write your tweet here..."
    maxlength="280"
  ></textarea>
</div>
</div>
<div class="control">
        <button type="submit" id="${e.target.id}" class="button is-small is-primary save">Save!</button>
</div>`);
  e.preventDefault();
};
const deleteHandler = async e => {
  let id = e.target.id;
  e.preventDefault();
  let url = "https://comp426fa19.cs.unc.edu/a09/tweets/" + id;
  const result = await axios({
    method: "delete",
    url: url,
    withCredentials: true
  })
    .then(response => {
      console.log(response);
      location.reload();
    })
    .catch(response => {
      console.log(response);
    });
};
const likeHandler = async e => {
  e.preventDefault();
  console.log(e.target);
  let id = e.target.id;
  let liked = $(e.target).attr("data-liked");

  if (liked == "false") {
    let link = "https://comp426fa19.cs.unc.edu/a09/tweets/" + id + "/like";
    const result = await axios({
      method: "put",
      url: link,
      withCredentials: true
    });
  } else {
    let link = "https://comp426fa19.cs.unc.edu/a09/tweets/" + id + "/unlike";
    const result2 = await axios({
      method: "put",
      url: link,
      withCredentials: true
    });
  }
};
const replyTweet = e => {
  e.preventDefault();
  console.log(e.target);
  $(`div[id=${e.target.id}]`).replaceWith(`
<div class="field">
<div class="control">
  <textarea id='reply-text'
    class="textarea is-info is-small"
    placeholder="Write your reply here..."
    maxlength="280"
  ></textarea>
</div>
</div>
<div class="control">
        <button type="submit" id="${e.target.id}" class="button is-small is-primary reply">Reply! </button>
</div>`);
};
const submitReplyHandler = async e => {
e.preventDefault();
let string = $('textarea[id=reply-text').val();
let id = e.target.id;
console.log(e.target.id);
console.log(string);
const result = await axios({
  method: 'post',
  url: "https://comp426fa19.cs.unc.edu/a09/tweets",
  withCredentials: true,
  data: {
    "type": "reply",
    "parent": id,
    "body": string
  },
})
.then(response => {
  console.log(response);
  location.reload();
})
.catch(response => {
  console.log(response);
});
}
const retweet = e => {
  e.preventDefault();
  $(`div[id=${e.target.id}]`).replaceWith(
`
<div class="field">
<div class="control">
  <textarea 
    id='retweet-text'
    class="textarea is-info is-small"
    placeholder="Write your retweet here..."
    maxlength="280"
  ></textarea>
</div>
</div>
<div class="control">
        <button type="submit" id="${e.target.id}" class="button is-small is-primary retweet">Retweet </button>
</div>
`);

}
const retweetHandler = async e => {
  e.preventDefault();
  const results = await axios({
    method: 'get',
    url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
    withCredentials: true,
  });
  let id = e.target.id
  let parent  = results.data.find(t => t.id == e.target.id);
  let string = $('#retweet-text').val();
  const result2 = await axios({
    method: 'post',
    url: "https://comp426fa19.cs.unc.edu/a09/tweets",
    withCredentials: true,
    data: {
      "type": "retweet",
      "parent": id,
      "body": ` <div> Retweet: ${string} <br> <h3> ${parent.author} </h3><p>${parent.body}</p> </div>`
    },
  })
  .then(response => {
    console.log(response);
    location.reload();
  })
  .catch(response => {
    console.log(response);
  });
}