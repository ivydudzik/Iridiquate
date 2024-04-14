class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
            if (choice.IsBombLocation == true) {
                console.log("this is a bomb location!")
                this.engine.gotoScene(BombLocation, choice.Target);
            } else {
                this.engine.gotoScene(Location, choice.Target);

            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class BombLocation extends Location {
    handleChoice(choice) {
        console.log("this is a bomb location handling a choice!")
        if (choice) {
            if (choice.Interaction) {
                this.engine.show("&gt; " + choice.Text);
                this.engine.storyData.Locations[choice.Target].Body = choice.NewBody;/// MESSY TRYING TO FIGURE OUT HOW COME IT HAPPENS TWICE AND HOW TO CHANGE STORYDATA ON THE FLY
                this.engine.gotoScene(Location, choice.Target);
            } else {
                this.engine.show("&gt; " + choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
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

Engine.load(Start, 'myStory.json'); // Creates Engine Instance and Starts Game