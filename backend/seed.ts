import dotenv from "dotenv";
import mongoose from "mongoose";
import { Pokemon } from "./modules/pokemon.model";

dotenv.config();

const pokemons = [
  {
    title: "Bulbasaur",
    image: "https://img.pokemondb.net/artwork/large/bulbasaur.jpg",
    description:
      "Bulbasaur is a small Grass/Poison type Pokemon that looks like a blue-green toad. " +
      "It carries a plant bulb on its back that was planted there from the day it was born. " +
      "The bulb soaks up sunlight and slowly grows bigger as Bulbasaur gets older. " +
      "It uses thin vines that come out of the bulb to grab objects and to attack opponents. " +
      "Bulbasaur spends most of its day lying in the sun to store energy for the bulb. " +
      "It is calm, patient and gentle, so it is a popular choice for new trainers. " +
      "In battle it uses moves like Vine Whip, Razor Leaf and Sleep Powder. " +
      "It can also release poison spores to weaken stronger enemies. " +
      "Bulbasaur lives in grassy fields and forests where there is plenty of sunlight. " +
      "It evolves into Ivysaur and later into the powerful Venusaur.",
    types: ["Grass", "Poison"],
    abilities: ["Overgrow", "Chlorophyll"],
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
    moves: ["Tackle", "Vine Whip", "Razor Leaf", "Sleep Powder"],
  },
  {
    title: "Charmander",
    image: "https://img.pokemondb.net/artwork/large/charmander.jpg",
    description:
      "Charmander is a small orange lizard Pokemon of the Fire type. " +
      "It has a flame burning at the tip of its tail from the moment it is born. " +
      "The flame shows how healthy and happy Charmander is at that time. " +
      "It burns brightly when the Pokemon is strong and flickers when it is weak. " +
      "If the flame ever goes out, Charmander can become very sick and may not survive. " +
      "It likes hot and dry places and is often found near volcanoes and caves. " +
      "Charmander fights with its sharp claws and with fire moves like Ember and Flamethrower. " +
      "It is a bit stubborn but very loyal to a trainer who treats it well. " +
      "It must keep its tail dry, because rain can make the flame weaker. " +
      "It evolves into Charmeleon and then into the mighty Charizard.",
    types: ["Fire"],
    abilities: ["Blaze", "Solar Power"],
    stats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
    },
    moves: ["Scratch", "Ember", "Flamethrower", "Dragon Breath"],
  },
  {
    title: "Charizard",
    image: "https://img.pokemondb.net/artwork/large/charizard.jpg",
    description:
      "Charizard is a large orange dragon-like Pokemon of the Fire/Flying type. " +
      "It has two big wings that let it fly high up in the sky. " +
      "It often flies around looking for strong opponents to fight. " +
      "Charizard is proud and will only use its fiercest fire against worthy challengers. " +
      "The flame on its tail burns even hotter than it did when it was a Charmander. " +
      "Its fire is so hot that it can melt rocks and boulders. " +
      "In battle it uses moves like Flamethrower, Wing Attack and Dragon Claw. " +
      "It is very strong and fast, which makes it a favourite of many trainers. " +
      "Charizard can be found in mountains and rocky areas near volcanoes. " +
      "It can also Mega Evolve into two different forms that make it even stronger.",
    types: ["Fire", "Flying"],
    abilities: ["Blaze", "Solar Power"],
    stats: {
      hp: 78,
      attack: 84,
      defense: 78,
      specialAttack: 109,
      specialDefense: 85,
      speed: 100,
    },
    moves: ["Flamethrower", "Wing Attack", "Dragon Claw", "Fly"],
  },
  {
    title: "Squirtle",
    image: "https://img.pokemondb.net/artwork/large/squirtle.jpg",
    description:
      "Squirtle is a small blue turtle Pokemon of the Water type. " +
      "It has a hard shell on its back that protects it from enemy attacks. " +
      "When it is in danger, it pulls its head, arms and legs into the shell. " +
      "From inside the shell it shoots powerful jets of water at its enemy. " +
      "The round shape of the shell and the grooves on it help Squirtle swim very fast. " +
      "It is playful, friendly and a little bit cheeky with other Pokemon. " +
      "Squirtle is usually found near rivers, ponds and lakes. " +
      "Its main moves include Water Gun, Bubble and Withdraw. " +
      "It is a good starter Pokemon because it is tough and easy to train. " +
      "Squirtle evolves into Wartortle and finally into the strong Blastoise.",
    types: ["Water"],
    abilities: ["Torrent", "Rain Dish"],
    stats: {
      hp: 44,
      attack: 48,
      defense: 65,
      specialAttack: 50,
      specialDefense: 64,
      speed: 43,
    },
    moves: ["Tackle", "Water Gun", "Bubble", "Withdraw"],
  },
  {
    title: "Pikachu",
    image: "https://img.pokemondb.net/artwork/large/pikachu.jpg",
    description:
      "Pikachu is a small yellow mouse Pokemon of the Electric type. " +
      "It has red cheeks that work like pouches to store electricity. " +
      "When it feels threatened, it releases the stored power to shock its enemy. " +
      "Sometimes it also releases a little electricity just to say hello. " +
      "Its long ears help it listen for danger from far away. " +
      "Pikachu lives in forests and often sleeps in groups with other Pikachu. " +
      "It rubs its cheeks on trees to get rid of the electricity that has built up. " +
      "In battle it uses moves like Thunder Shock, Quick Attack and Thunderbolt. " +
      "It is energetic, curious and very loyal to its trainer. " +
      "Pikachu evolves into Raichu when it is exposed to a Thunder Stone.",
    types: ["Electric"],
    abilities: ["Static", "Lightning Rod"],
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
    },
    moves: ["Thunder Shock", "Quick Attack", "Thunderbolt", "Iron Tail"],
  },
  {
    title: "Jigglypuff",
    image: "https://img.pokemondb.net/artwork/large/jigglypuff.jpg",
    description:
      "Jigglypuff is a round pink balloon-like Pokemon of the Normal/Fairy type. " +
      "It has big blue-green eyes and a soft, bouncy body. " +
      "Jigglypuff can puff itself up like a balloon by taking in a lot of air. " +
      "It is best known for its beautiful singing voice. " +
      "The song is a lullaby that makes anyone who listens fall fast asleep. " +
      "Jigglypuff gets very upset when its audience falls asleep before the song is finished. " +
      "When that happens, it likes to draw on the sleeping faces with a marker. " +
      "Its vocal cords are very strong, so it can sing without a break for a long time. " +
      "In battle it uses moves like Sing, Pound and Double Slap. " +
      "It evolves into Wigglytuff when it is exposed to a Moon Stone.",
    types: ["Normal", "Fairy"],
    abilities: ["Cute Charm", "Competitive"],
    stats: {
      hp: 115,
      attack: 45,
      defense: 20,
      specialAttack: 45,
      specialDefense: 25,
      speed: 20,
    },
    moves: ["Sing", "Pound", "Double Slap", "Rollout"],
  },
  {
    title: "Psyduck",
    image: "https://img.pokemondb.net/artwork/large/psyduck.jpg",
    description:
      "Psyduck is a yellow duck-like Pokemon of the Water type. " +
      "It is always holding its head because it has a constant headache. " +
      "The headache gets worse when Psyduck is stressed or confused. " +
      "When the pain becomes too strong, it unlocks hidden psychic powers. " +
      "In that state it can do surprising things, but it forgets about it afterwards. " +
      "Psyduck is clumsy and slow, and it often looks lost. " +
      "Even so, it is a decent swimmer and spends a lot of time in shallow water. " +
      "It is usually found near lakes, rivers and marshes. " +
      "Its moves include Water Gun, Confusion and Psybeam. " +
      "Psyduck evolves into the stronger Golduck, which is a very fast swimmer.",
    types: ["Water"],
    abilities: ["Damp", "Cloud Nine"],
    stats: {
      hp: 50,
      attack: 52,
      defense: 48,
      specialAttack: 65,
      specialDefense: 50,
      speed: 55,
    },
    moves: ["Scratch", "Water Gun", "Confusion", "Psybeam"],
  },
  {
    title: "Gengar",
    image: "https://img.pokemondb.net/artwork/large/gengar.jpg",
    description:
      "Gengar is a purple Pokemon of the Ghost/Poison type with a wide, sneaky grin. " +
      "It likes to hide in the dark and in the shadows of buildings. " +
      "Legends say it can hide in a person's shadow and follow them around. " +
      "People sometimes feel the room get suddenly cold when Gengar is nearby. " +
      "It loves to play tricks and scare people just for fun. " +
      "Gengar can also be dangerous because it is said to steal the life of its victims. " +
      "It moves silently and can pass through walls without making a sound. " +
      "In battle it uses moves like Shadow Ball, Lick and Hypnosis. " +
      "It is quick, clever and a bit of a prankster. " +
      "Gengar evolves from Haunter, which evolves from Gastly after trading.",
    types: ["Ghost", "Poison"],
    abilities: ["Cursed Body"],
    stats: {
      hp: 60,
      attack: 65,
      defense: 60,
      specialAttack: 130,
      specialDefense: 75,
      speed: 110,
    },
    moves: ["Shadow Ball", "Lick", "Hypnosis", "Sludge Bomb"],
  },
  {
    title: "Eevee",
    image: "https://img.pokemondb.net/artwork/large/eevee.jpg",
    description:
      "Eevee is a small, fluffy Normal type Pokemon with brown fur. " +
      "It has a cream-coloured fluffy collar and a bushy tail. " +
      "Its genetic makeup is unstable, which makes it very special. " +
      "Because of this, Eevee can evolve into many different forms. " +
      "The form depends on things like stones, friendship or the time of day. " +
      "It can become Vaporeon, Jolteon, Flareon, Espeon, Umbreon and more. " +
      "Eevee is friendly, loyal and adapts quickly to new places. " +
      "It is rare in the wild, so many trainers are lucky to get one. " +
      "In battle it uses moves like Tackle, Sand Attack and Quick Attack. " +
      "Its ability to change makes it one of the most popular Pokemon of all.",
    types: ["Normal"],
    abilities: ["Run Away", "Adaptability", "Anticipation"],
    stats: {
      hp: 55,
      attack: 55,
      defense: 50,
      specialAttack: 45,
      specialDefense: 65,
      speed: 55,
    },
    moves: ["Tackle", "Sand Attack", "Quick Attack", "Bite"],
  },
  {
    title: "Snorlax",
    image: "https://img.pokemondb.net/artwork/large/snorlax.jpg",
    description:
      "Snorlax is a huge, round Normal type Pokemon with a dark blue-green body. " +
      "It has a cream belly and a very sleepy expression. " +
      "It eats hundreds of kilograms of food every single day. " +
      "Once it is full, it lies down and goes straight back to sleep. " +
      "Snorlax is so hard to wake up that trainers use a special flute for it. " +
      "It is gentle and does not mind when children play on its big belly. " +
      "It can eat almost anything, even food that has gone bad, without getting sick. " +
      "Snorlax often blocks roads and paths when it decides to take a nap. " +
      "In battle it uses moves like Body Slam, Rest and Hyper Beam. " +
      "Its huge size and strong defence make it a very tough opponent.",
    types: ["Normal"],
    abilities: ["Immunity", "Thick Fat", "Gluttony"],
    stats: {
      hp: 160,
      attack: 110,
      defense: 65,
      specialAttack: 65,
      specialDefense: 110,
      speed: 30,
    },
    moves: ["Body Slam", "Rest", "Hyper Beam", "Yawn"],
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected Database");

    await Pokemon.deleteMany();
    await Pokemon.insertMany(pokemons);

    console.log("Pokemons added successfully");
  } catch (error) {
    console.log("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
