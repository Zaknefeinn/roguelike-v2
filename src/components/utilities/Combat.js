export const EnemyStats = level => {
  const randomNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  let attack;
  let health;
  level !== 0
    ? ((attack = 7 * (level / 2) + randomNumber),
      (health = 10 * (level / 2) + randomNumber))
    : ((attack = 3 + randomNumber), (health = 10));
  return { attack, health };
};

export const Combat = (playerStats, enemyStats) => {
  const playerHp = playerStats.health - enemyStats.attack;
  const newEnemyHp = enemyStats.health - playerStats.attack;
  let playerXP = playerStats.nextLevel;
  let playerLevel = playerStats.level;
  let playerAtk = playerStats.attack;

  //Check if enemy is dead
  newEnemyHp > 0
    ? (playerXP = playerStats.nextLevel)
    : (playerXP = playerStats.nextLevel - 20);
  //Check if player should level up
  playerXP <= 0
    ? ((playerLevel = playerStats.level + 1), (playerXP = 60))
    : (playerLevel = playerStats.level);
  
  const newPlayerStats = {
    attack: playerAtk,
    health: playerHp,
    level: playerLevel,
    nextLevel: playerXP,
    weapon: 'Stick'
  };
  console.log(newPlayerStats);
  return { newPlayerStats, newEnemyHp };
  // return { newPlayerHp, newEnemyHp, playerXP, playerLevel };
};
