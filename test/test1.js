FBInstant
  .getLeaderboardAsync('my_awesome_leaderboard.' + context.getID())
  .then(function(leaderboard) {
  	console.log(leaderboard.getName());
    return leaderboard.setScoreAsync(42, '{race: "elf", level: 3}');
  })
  .then(function() { console.log('Score saved') })
  .catch(function(error) { console.error(error) } );