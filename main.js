/***************************************** VARIABLES ***********************************************/

const $rollBtn = $('#rollBtn');
const $raceModExplain = $('#raceModExplain');
const $classModExplain = $('#classModExplain');
const $select = $('select');

const races = {
    Dwarf: 'Dwarves gain a +2 bonus to Constitution.',
    Elf: 'Elves gain a +2 bonus to Dexterity.',
    Halfling: 'Halflings gain a +2 bonus to Dexterity.',
    Human: 'Humans gain a +1 bonus to all abilities.',
    Dragonborn: 'Dragonborn gain a +2 bonus to strength and a +1 bonus to charisma.',
    Gnome: 'Gnomes gain a +2 bonus to Intelligence.',
    'Half-Elf': "Half-Elves gain a +2 bonus to Charisma as well as a +1 bonus to two more abilities of the player's choice.",
    'Half-Orc': 'Half-Orcs gain a +2 bonus to strength and a +1 bonus to constitution.',
    Tiefling: 'Tieflings gain a +1 bonus to intelligence and a +2 bonus to charisma.',
};

const classes = {
    Barbarian: 'Barbarians are wild warriors',
    Bard: 'Bards are performers whose songs cast magic.',
    Cleric: 'Clerics draw magical power from the gods.',
    Druid: 'Druids draw magical power from nature.',
    Fighter: 'A fighter is a trained physical warrior.',
    Monk: 'Monks draw power from ki energy.',
    Paladin: 'Paladins are mighty holy fighters who draw power from the gods.',
    Ranger: 'Rangers are hunters that roam the wilds and protect the outskirts of villages and towns.',
    Rogue: 'Rogues are thieves.',
    Sorcerer: 'Sorcerers are born with the ability to cast magic.',
    Warlock: 'Warlocks make a pact with a patron that grants them magical powers.',
    Wizard: 'Wizards study spell books to gain great magical powers.',    
};

const equipment = {
    Barbarian: [['greataxe', 'martial melee weapon'], ['two handaxes', 'any simple weapon'], ["an explorers pack and four javelins"]],
    Bard: [['rapier', 'longsword', 'simple weapon'], ["a diplomat's pack", "an entertainer's pack"], ['a lute', 'other musical instrument'], ['Leather armor and a dagger']],
    Cleric:[['a mace', 'a warhammer (if proficient)'], ['scale mail', 'leather armor', 'chain mail (if proficient)'], ['a light crossbow and 20 bolts', 'any simple weapon'], ["a priest's pack", "an explorer's pack"], ['a shield and a holy symbol']],
    Druid: [['a wooden shield', 'any simple weapon'], ['a scimitar', 'any simple melee weapon', "Leather armor, an explorer's pack, and a druidic focus"]],
    Fighter: [['chainmail', 'lether armor, longbow, and 20 arrows'], ['a martial weapon and a shield', 'two martial weapons'], ['a light crossbow and 20 bolts', 'two handaxes'], ["a dungeoneer's pack", "an explorer's pack"]],
    Monk: [['a shortsword', 'any simple weapon'], ["a dungeoneer's pack", "an explorer's pack"], ['10 darts']],
    Paladin: [['a martial weapon and a shield', 'two martial weapons'], ['five javelins', 'any simple melee weapon'], ["a priest's pack", "an explorer's pack"], ['Chain mail and a holy symbol']],
    Ranger: [['scale mail', 'leather armor'], ['two shortswords', 'two simple melee weapons'], ["a dungeoneer's pack", "an explorer's pack"], ['a longbow and a quiver of 20 arrows']],
    Rogue: [['a rapier', 'a shortsword'], ['a shortbow and quiver of 20 arrows', 'a shortsword'], ["a burglar's pack", "a dungeoneer's pack", "an explorer's pack"], ["leather armor, two daggers, and thieve's tools"]],
    Sorcerer: [['a light crossbow and 20 bolts', 'any simple weapon'], ['a component pouch', 'an arcane focus'], ["a dungeoneer's pack", "an explorer's pack"], ['two daggers']],
    Warlock: [['a light crossbow and 20 bolts', 'any simple weapon'], ['a component pouch', 'an arcane focus'], ["a scholar's pack", "a dungeoneer's pack"], ['leather armor, any simple weapon, and two daggers']],
    Wizard: [['a quarterstaff', 'a dagger'], ['a component pouch', 'an arcane focus'], ["a scholar's pack", "an explorer's pack"], ['a spellbook']],
};

//Meant to hold six values: str, dex, con, int, wis, and cha
const abilities = [];

const abilityAppend = [$('#str .attr'), $('#dex .attr'), $('#con .attr'), $('#int .attr'), $('#wis .attr'), $('#cha .attr')];
const abilityMod = [$('#str .mod'), $('#dex .mod'), $('#con .mod'), $('#int .mod'), $('#wis .mod'), $('#cha .mod')];

/***************************************** FUNCTIONS ***********************************************/

//function that rolls four D6 and drops the lowest number
function rollStats() {
    const array = [];
    let total = 0;
    let i;    
    //Roll four d6
    for (i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * 6) + 1;
        array.push(random)
    }    
    //Sink lowest number to end of array
    for (i = 0; i < 4; i++) {
        let temp;
        while (array[i] < array[i + 1]) {
            temp = array[i];
            array[i] = array [i + 1];
            array [i + 1] = temp;
        }
    }    
    //Remove last/lowest number in array
    array.pop();
    
    //Add elements in array
    for (i = 0; i < array.length; i++) {
        total += array[i];
    }    
    return total;
}

//function that adds a racial bonus to specific abilities
function racialBonus(race) {
    if (race === 'Dwarf') {
            abilities[2] += 2;
        }else if (race === 'Elf') {
            abilities[1] += 2;
        }else if (race === 'Halfling') {
            abilities[1] += 2;
        }else if (race === 'Human') {
            abilities[0] += 1;
            abilities[1] += 1;
            abilities[2] += 1;
            abilities[3] += 1;
            abilities[4] += 1;
            abilities[5] += 1;
        }else if (race === 'Dragonborn') {
            abilities[0] += 2;
            abilities[5] += 1;
        }else if (race === 'Gnome') {
            abilities[3] += 2;
        }else if (race === 'Half-Elf') {
            abilities[5] += 2;
        //add choice fo 2 other attributes to increase by 2
        }else if (race === 'Half-Orc') {
            abilities[0] += 2;
            abilities[2] += 1;
        }else if (race === 'Tiefling') {
            abilities[3] += 1;
            abilities[5] += 2 ;
        }//end if...else
}

/***************************************** EVENT LISTENERS ***********************************************/

//Explain ability benefits of selected race and describe class based off of which select menu is changed
$select.on('change', () =>{
    $('.equipment').empty();

    if ($select.hasClass('raceSelect')) {
        $raceModExplain.empty();
        let race = $(".raceSelect option:selected").html();
        for (let key in races) {
            if (race === key) {
                $raceModExplain.append(races[key]);
            }//end inner if
        }//end for
    }// end outer if
    
    if ($select.hasClass('classSelect')) {
        $classModExplain.empty();
        let playerClass = $(".classSelect option:selected").html();
        for (let key in classes) {
            if (playerClass === key) {
                $classModExplain.append(classes[key]);
                for (let i = 0; i < equipment[key].length; i++) {
                    let sel = document.createElement('select');
                    let $sel = $(sel);
                    $('.equipment').append($sel);
                    for (let j = 0; j < equipment[key][i].length; j++) {
                        let opt = document.createElement('option');
                        opt.innerHTML = equipment[key][i][j];
                        $(opt).addClass('col');
                        $sel.append(opt);
                    }// end inner
                }// end outer for
            }//end inner if            
        }//end for
    }//end outer if
});// end change event for select menus

// Roll for each stat and include racial modifier as well as ability modifier
$rollBtn.on('click', () =>{   
    // Empty attribute and modifier <p> elements
    for (let key in abilities) {
        abilities[key] = 0;
    }// end for
    
    $('.attr').empty();
    $('.mod').empty();
    
    for (let i = 0; i < 6; i++) {
        abilities[i] = rollStats();
    }//end for
   
    //Determine bonus attribute points based off of race
    let race = $(".raceSelect option:selected").html();
    racialBonus(race);
    
    //Append ability scores to designated ability
    for (let i = 0; i < 6; i++) {
        abilityAppend[i].append(String(abilities[i]));
    }

    //Change roll button to reroll button
    $rollBtn.empty().append('Reroll');  
    
    //Add ability modifier
    for (let i = 0; i < 6; i ++) {
            if (parseInt(abilityAppend[i].html()) === 3) {
                abilityMod[i].append('-4');
            }// end if
            if (parseInt(abilityAppend[i].html()) === 20) {
                abilityMod[i].append('+5');
            }// end if
            if (parseInt(abilityAppend[i].html()) >= 4 && abilityAppend[i].html() < 20) {
                let k = -3;
                for (j = 4; j < 20; j += 2) {
                    if (parseInt(abilityAppend[i].html()) >= j && abilityAppend[i].html() < (j + 2)) {
                        if (k < 0) {
                            abilityMod[i].append(k);
                        } else {
                            abilityMod[i].append('+' + k);
                        }// end if...else
                }// end if
                k ++;            
            }// end for
        }//end if
    }//end for    
});// end rollBtn event listener

    
    
    
    
    
    
    
    
    
    
    
    