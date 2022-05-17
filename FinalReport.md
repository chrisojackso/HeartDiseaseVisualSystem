# Overview and Motivation
The goal of this project was to create a system where a user such as a doctor can look at patient information
and see what demographics and variables are common among people with heart disease. The motivation for this 
is so a doctor can easily understand indicators of heart disease in their population and warn future patients 
if they are showing these indicators.

# Related Work
I wanted to build a system that achieved the same purpose as this visualization does by oracle.
https://blogs.oracle.com/analytics/post/predict-heart-disease-with-oracle-data-visualization

# Goals and Tasks
What was the best way to visualize the data I had? What was the best way to make multiple views that interacted with eachother for the purpose of exploring the 
heart disease factors? What variables showed a larger percentage of people with heart disease? Over the course of the analysis I started to wonder how important BMI
was to predicting heart disease because I assumed it would be the most important.

#Data
I did not do any transformation of the original CSV file. In the main.js file you can see I had to make a variable called groupData that stored the key value data for
the grouped barchart. I did this because to make a grouped barchart I needed to have how many instances a certain variable occured which the original CSV does not have.
This is why I made a Key for the variables I wanted in the grouped bar chart and then the value being the length of how many times 2 conditions were met. 
Example.

            const groupData = [
                { key: 'Male', values:
                        [
                            {grpName:'Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'Yes' && d.Sex == 'Male').length},
                            {grpName:'No Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'No' && d.Sex == 'Male').length},

                        ]
                },
                { key: 'Female', values:
                        [
                            {grpName:'Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'Yes' && d.Sex == 'Female').length},
                            {grpName:'No Heart Disease', grpValue:data.filter(d => d.HeartDisease == 'No' && d.Sex == 'Female').length},

                        ]
                }]
                
# Visualization Design
my visual design consisted of 4 different views. A scatterplot where you could change the x and y axis with different variables. A barchart that showed the age ranges
and how many instances were in a certain age range. A grouped barchart where you could change the variable and see how many did and did not have heart disease for that
variable. And a parallel coordinates plot. I chose the scatterplot and barchart because it provided a great interaction where the user could explore the variables
through the x and y axis changes and also then filter the scatterplot down through the age categories. So if a user only wanted to see how important Sleep Time and BMI was
for heart disease to the 18 to 30 year old categories they could easily do that. The reasoning for the grouped barchart is because I felt it was the best way to explore the 
Yes and No variables of the dataset. This allows the user to easily see if there is a certain race, gender, etc. that has an abnormal amount of heart disease in their population.
The parallel coordinates plot was another way to see how patients who had heart disease gravitated towards certain values in variables.

# Visualization Results

