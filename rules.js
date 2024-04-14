class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(BombLocation, this.engine.storyData.InitialLocation); // InitialLocation is first BombLocation
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
            if (choice.IsBombLocation) {
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
            if (choice.IsBombPlant) {
                this.engine.show("&gt; " + choice.Text);
                this.engine.storyData.Locations[choice.Target].Body = choice.NewBody;
                this.engine.storyData.Locations[choice.Target].Choices.splice(this.engine.storyData.Locations[choice.Target].Choices.indexOf(choice), 1);
                this.engine.bombSitesRemaining -= 1;
                this.engine.gotoScene(BombLocation, choice.Target);
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

const numberOfBombsToPlant = 4;
Engine.load(Start, 'myStory.json', numberOfBombsToPlant); // Creates Engine Instance and Starts Game