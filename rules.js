class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        
        // Shadow Room Functionality
        if (key === "Shadowy Sidestreets") {
            if (this.engine.flags.hasHand === false && this.engine.flags.hasProstheticHand !== true) {
                this.engine.show(locationData.Body);
            }else {
                this.engine.show("Damn its dark in here. Its actually super spooky. If you had some kind of fire or maybe were on fire you could probably see a lot better in here.");
            }
        }else {
            this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        }


        // Adding Lava Key Scene
        if (key === "Lava Cascades of Very Probable Somewhat Certain Death") {
            if (!this.engine.flags.hasKey) {
                this.engine.flags.hasKey = true;
                this.engine.flags.hasHand = false;
                this.engine.show("As you look down into the large lava basin, you see a shiny key floating at the surface. It looks super scary which means it has to be important. You carefully lower your hand towards the key hoping you can safely scoop it out. Unfortunatly the odds were not in your favor. Your hand erupts into flames and you launch the key into the air. Good news: you now have a really cool key. Bad news: your hand is now a burning charred stump :(");
            }else {
                this.engine.show("You look down at your hand and then back at the empty pool of lava. Why did you take that key. What were you thinking??");
            }
        }

        // Adding Hospital Functionality
        if (key === "One-Handed Hospital") {
            if (this.engine.flags.hasHand === false && !this.engine.flags.hasProstheticHand) {
                this.engine.flags.hasProstheticHand = true;
                this.engine.show("Oh my god we can fix your hand right up. It just might take a second because all of our surgeons only have 1 hand. Its kind of like how eye doctors that preform laser eye surgery still wear glasses. It's because this shit gets pretty metal. Anyway go lie down on this table and will stick this bad boy right on. And by this badboy I mean your new prosthetic hand. *Thunk* there you go and thats on the hosue.");
            }else if (this.engine.flags.hasProstheticHand === true) {
                this.engine.show("Um we already fixed your shit so I don't know what else you want from us. Actually it's kind of crazy that you'd even come back looking for more. I swear its like some people just take and take and take. Its disgusting go do somethimg productive before I get angry.");
            }else {
                this.engine.show("Oh wait but you're in the wrong place for a guy with two perfectly working hands. If your looking for some advice go to the lava cascades I've heard its really nice there. You know relatively speaking because everything in this maze fucking sucks.");
            }
        }

        // Locked door Lagoon functionality

        if (key === "Locked Door Lagoon"){
            if (this.engine.flags.hasKey !== true){
                this.engine.show("If only I had a large and spooky key. *GO TO THE LAVA CASCADES* the wind howls. Hmmm I think I need to go to the lava cascades")
            }else{
                this.engine.show("Thank god you burned your hand off to get that cool key. Now maybe you can get out of this freakish hellscape.");
            }
        }
        /*
        if(locationData.Choices && locationData.Choices.length > 0) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current ccode of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
        */
       
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
        
                if (choice.RequireFlags) {
                    let show = true;
                    for (let req of choice.RequireFlags) {
                        if (req.startsWith("!")) {
                            let flagName = req.slice(1);
                            if (this.engine.flags[flagName] === true) {
                                show = false;
                                break;
                            }
                        } else {
                            if (this.engine.flags[req] !== true) {
                                show = false;
                                break;
                            }
                        }
                    }
                    if (!show) continue; 
                }
        
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');