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
            console.log("choices for ", key, " ", locationData.Choices);
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
            this.filterGoTo(choice);
        } else {
            this.engine.gotoScene(End);
        }
    }

    filterGoTo(choice) {
        if (choice.IsBombLocation) {
            console.log("this is a bomb location!")
            this.engine.gotoScene(BombLocation, choice.Target);
        } else if (choice.IsDetonationLocation) {
            console.log("this is a detonation location!")
            this.engine.gotoScene(DetonationLocation, choice.Target);
        } else if (choice.IsKeyLocation) {
            console.log("this is a key location!")
            this.engine.gotoScene(KeyLocation, choice.Target);
        } else {
            console.log("this is a normal location!")
            this.engine.gotoScene(Location, choice.Target);
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
                this.filterGoTo(choice);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class KeyLocation extends Location {
    handleChoice(choice) {
        console.log("this is a key location handling a choice!")
        if (choice) {
            if (choice.IsCollectBoat) {
                let targetLocation = this.engine.storyData.Locations[choice.Target];
                let doorLocation = this.engine.storyData.Locations[choice.Door];
                this.engine.show("&gt; " + choice.Text);
                targetLocation.Body = choice.NewBody;
                doorLocation.Body = doorLocation.Body.concat(choice.AdditionalDoorBody);
                doorLocation.Choices.push(targetLocation.Choices[targetLocation.Choices.indexOf(choice)].AdditionalDoorChoice);
                targetLocation.Choices.splice(targetLocation.Choices.indexOf(choice), 1);
                this.engine.boatCollected = true;
                this.engine.gotoScene(KeyLocation, choice.Target);
            } else {
                this.engine.show("&gt; " + choice.Text);
                this.filterGoTo(choice);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class DetonationLocation extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                if (choice.IsBombDetonation) {
                    if (this.engine.bombSitesRemaining == 0)
                        this.engine.addChoice(choice.Text, choice);
                } else {
                    this.engine.addChoice(choice.Text, choice);
                }

            }
        } else {
            this.engine.addChoice("The end.")
        }
    }
    handleChoice(choice) {
        console.log("this is a detonation location handling a choice!")
        if (choice) {
            if (choice.IsBombDetonation) {
                this.engine.show("&gt; " + choice.Text);
                this.engine.storyData.Locations[choice.Target].Body = choice.NewBody;
                this.engine.storyData.Locations[choice.Target].Choices = null; // .splice(0, this.engine.storyData.Locations[choice.Target].Choices.length)
                this.engine.gotoScene(DetonationLocation, choice.Target);
            } else {
                this.engine.show("&gt; " + choice.Text);
                this.filterGoTo(choice);
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