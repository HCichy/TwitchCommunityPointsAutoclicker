function setup() {
  window.console.log("Starting community points clicker!");
  window.setInterval(() => {
    getAndClickCommunityBtn();
  }, 5000);
}

function getAndClickCommunityBtn() {
  let communityPointsGroup = document.querySelector(
    "div.community-points-summary"
  );
  if (communityPointsGroup) {
    let communityPointsButton = communityPointsGroup.querySelectorAll("button");
    if (communityPointsButton[1]) {
      communityPointsButton[1].click();
      window.console.log("Clicked!");
    }
  }
}

setup();
