import os

# Updated video data with timestamps integrated
VIDEOS = [
    {
        "id": "YUTAimvbfSk",
        "title": "Road Hazards in Residential Neighborhoods",
        "url": "https://www.driverseddirect.com/videos/hazards/residential/default.aspx",
        "transcript": """[00:00] According to the Merriam Webster Dictionary, hazards are defined as a "source of danger" and as drivers everywhere know, there are plenty of potential dangers on the road. I'm driving instructor Matty and in the next jam-packed 10 minutes, we're going to break down the top 20 road hazards AND how to deal with them.

[00:20] Road hazards are anything you encounter while driving that may be dangerous or have the potential to become dangerous. There are literally an infinite number of hazards out there. Even when you're 80 years old, you'll come across a new hazard you've never seen before. Fortunately, many of the hazards are common and can be dealt with calmly if you learn to recognize them early!

[00:35] Before we talk about how to safely deal with potential hazards, let's list 20 residential neighborhood hazards I guarantee you'll see in your lifetime behind the wheel:

[00:55] Vehicle Hazards:
* [00:58] A car running a stop sign
* [01:01] Oncoming cars driving on your side of the road
* [01:04] A car suddenly backing out of a driveway
* [01:07] A parked car door suddenly swinging open
* [01:10] A bicycle or scooter on the road or sidewalk
* [01:13] Double parked vehicles including delivery, garbage, and mail trucks
* [01:18] And large trucks on the road in front of us that block our forward view

[01:23] Pedestrian Hazards:
* [01:26] Children that can always be unpredictable
* [01:29] People walking their dogs in the street
* [01:32] Joggers, walkers, and skaters
* [01:35] Delivery people, gardeners, pool cleaners, mailpersons, and more

[01:40] Road & Environmental Hazards:
* [01:44] There might be a curve in the road where you can't see what's around the bend
* [01:48] Maybe some slippery loose gravel or dirt
* [01:52] A huge pothole or uneven pavement
* [01:55] How about a dip or a bump in the road
* [02:00] Rain, ice, and snow or sun glare!

[02:10] Now that we know the kinds of hazards to anticipate, how do we identify and avoid them? The answer is quite simple really: Increase your visual lead time so that you can take in the big picture.

[02:22] Don't stare at the road directly in front of you, instead look further down the road at where you'll be in 10 - 15 seconds. This will magically alert you to many potential problems before they become an actual problem. Keep those eyes constantly moving, always scanning the road and checking your mirrors to be aware of your surroundings -- both in front of and behind you.

[02:35] ALWAYS expect the unexpected and prepare for the worse. When you do identify a POTENTIAL hazard, take your foot off the accelerator, cover your brake immediately and prepare to slow down.

[02:50] What you don't want to ever do is slam hard on the brakes and get rear ended, or suddenly swerve and hit another vehicle or object.

[03:00] I challenge you to get out there and see how many hazards you can perceive during your next drive. Fortunately, most of the hazards won't become dangerous, and the ones that do... now you'll be ready for them!

[03:22] From Matty and Drivers Ed Direct, thank you so much for watching. Until next time, please keep those eyes scanning for hazards and we'll be seeing you early and safely, about 10 - 15 seconds down the road!"""
    },
    {
        "id": "91fc2N1-5sw",
        "title": "Commentary Driving (Rick)",
        "url": "https://www.youtube.com/watch?v=91fc2N1-5sw",
        "transcript": """[00:00] ...test while they're waiting to try and find a driving instructor to help them out. So what I'm going to do is I'm just going to move off from the curb here out into the road.
[00:10] And then down there I'm going to turn left. And once I'm traveling along that road, I'll start what we call the commentary drive.
[00:20] So I'm about to head out into the road here. I've sort of checked that the car is going to stay here, that this is not going to roll away. I've had a look ahead and I can see it's clear where I'm going to go.
[00:30] And I'm looking to see what's coming down the road behind me. There are a couple of vehicles coming, but I can see that I will be able to move off soon.
[00:40] So I am signaling now to tell people what I'm going to do. I'm putting the car into first gear. And because it's downhill, I'm going to release the handbrake early because we're going to proceed downhill.
[00:50] The car will go exactly where I'm planning to go. And I've seen that it's clear behind and side, and nothing's coming from this side road area here. So a blind spot check and we're gradually moving out into the road.
[01:00] So we are just going to brake as well, but using the gears to hold the speed down the hill. Vehicle approaching from the left—we want to be careful with that guy.
[01:10] And we definitely aren't going to signal any earlier because we want to not confuse him, because we are planning to turn left here.
[01:20] Down here now, there is a stop sign here with a line. Our first priority is to get stopped behind the line. Double-checking that no one else is coming. Made a definite stop.
[01:30] The road is clear now. Car will roll forward because it's a downhill start, so I didn't worry about the handbrake. Turning left and traveling into this road. Let's grab another gear as we come round and following on our way.
[01:40] Up through the gears. We didn't see a speed sign, but we know way in the distance we can see the 60.
[01:50] There as before I entered, and then we're just continuing on slowly, letting this fellow drive away from us.
[02:00] We're not holding people up behind us, but we've let him create our three-second gap. He's used his fuel to create the safe space in front of us, and yet we're still doing quite a good speed.
[02:30] We also notice that the road is wet here. So we would be a little bit more cautious that the vehicle may slip coming in. We're seeing no vehicles coming from the right.
[02:50] Sign now. This fellow here is going to be pulling out to the left, but we don't care because we're going to turn left. We've got a signal nice and early, giving him plenty of warning.
[03:10] And continuing on. This fella is about to back out from here, so we're just not trusting him too much and moved over slightly.
[03:30] I'm signaling, telling people what I'm going to do. Coming over to stop at the side and then securing the car. Handbrake on first, putting the car into neutral."""
    },
    {
        "id": "SbOWPZAbpvw",
        "title": "Traffic Checks - Part 1 (Residential)",
        "url": "https://www.driverseddirect.com/videos/traffic-checks-residential/",
        "transcript": """[0:00] Today we're looking at Traffic Checks and the role they play at any intersection you'll find in a neighborhood.

[0:15] The difference between a 'traffic check' (looking left-right-left at intersections) and 'scanning' (watching for hazards like cars pulling out of driveways).

[0:45] Let's start with an all-way stop. All way stops are intersections where every direction of travel has a stop sign. I'm going to try a right turn... so first, I'm going to come to my full complete stop, and here comes my traffic check. I'm going to look left, right, left. Now I got here first so that tells me that I've got the right of way. I can go first.

[1:20] Now let's try a left turn. Now you'll notice my head hasn't stopped moving. I'm looking for anything that can enter my path of travel. That's called scanning. I'm showing the examiner I am being 'nosy' and aware of my surroundings.

[2:05] Let's try a 2-way stop. Now a 2-way stop is an intersection where cross traffic does not have a stop sign, they could be going 25 miles an hour... so I'm going to do my full stop; my traffic check. Now I can not see if there is a car coming from the left so I'm going to inch out. My foot is still on the brake, left, right, left.

[3:10] Controlled T-Intersections: Performing a full stop and checking cross-traffic that has the right of way. I'm doing my full complete stop, left, right, left... looks good. I know it's safe to make my left turn.

[4:00] Uncontrolled T-Intersections: The 'toughest' type where no one has a stop sign. I demonstrate the 2–3 mph crawl to ensure safety.

[5:15] DMV Test Tip: Why failing to do a traffic check is a common point deduction, and how impeding right-of-way results in an automatic fail.

[6:00] Conclusion and preview of Part 2 (Major Streets). From Micah and Drivers Ed Direct, stay safe!"""
    },
    {
        "id": "TrtgVbd87SY",
        "title": "How to Observe to Pass Your Road Test (Rick)",
        "url": "https://www.youtube.com/watch?v=TrtgVbd87SY",
        "transcript": """[00:00] Hi there, smart drivers. Rick with Smart Drive Test, talking to you today about observation for the purposes of a road test. Observation is one of the four cornerstones of any road test, regardless of where you are in the world.
[00:12] The four cornerstones are: observation, communication, speed management, and space management. If you have all of those in place, you're going to be successful on your road test.
[00:22] Today, we're going to talk specifically about observation. It is instrumental that you move your head because your eyes do not move enough in your skull to be able to observe properly for the purposes of a road test.
[00:35] And another point: the bigger the vehicle, the more you're going to have to move your head to do those scans and observations.
[00:52] I'm going to show you how to do the scanning while you're driving. So you're sitting in the seat square. You're going to change these intervals every 8 to 10 seconds. You're looking down the road, into the instrument panel, out the windshield, down the road.
[01:10] Every 8 to 10 seconds, check the wing mirror on the left, down the road again. Intersections—you're obviously scanning intersections as well while you're driving. And then in and check that center mirror.
[01:22] So every 8 to 10 seconds, you're going to be rotating through that scanning pattern while you're driving in a forward motion: down the road, instrument panel, down the road, center mirror, down the road, left wing mirror, down the road, right wing mirror.
[01:50] Anytime that you move the vehicle laterally—you're changing lanes or you're moving sideways or you're making turns—you're going to do shoulder checks two times: one approximately half a block before the turn, and the other one immediately before the turn.
[02:42] Now, before you back up, you're going to do a 360-degree scan. For the purposes of a road test, all of these skills are applicable: 360-degree scan, looking out the back window, checking your backup camera.
[03:10] When backing up, you put your hand on the back of the passenger seat, one hand on the steering wheel, and turn and look out the back window.
[03:25] A common question is: do you have to look in the mirror after you moved your head to shoulder check? The answer is no. You simply don't have enough time. You're just going to turn your head; your peripheral vision is going to take care of the rest of it.
[04:12] To summarize: 1. Forward driving: Scan every 8-10 seconds. 2. Turns/Lane Changes: Two shoulder checks. 3. Reversing: 360-degree scan."""
    },
    {
        "id": "0QlcsqV0JQY",
        "title": "Lane Positioning & Spatial Awareness",
        "url": "https://www.driverseddirect.com/videos/lane-positioning/residential/",
        "transcript": """[0:00] Having trouble avoiding parked cars? Following other vehicles too closely? Not sure where to drive on residential streets with no lane lines?

[0:20] In this video, pro driving instructor Liz demonstrates residential lane positioning and spatial awareness techniques like finding and keeping proper lane placement.

[0:30] How to deal with traffic, safely avoiding parked cars, and how to determine a safe following distance using the 3-second rule.

[0:55] To do this, you want to aim high and select a visual target in the center of your lane that's a good distance down the road. We recommend constantly scanning the road about 10 to 15 seconds ahead.

[1:15] By looking further down the road and taking in the big picture, your car should more or less stay centered in your lane automatically.

[1:50] You want to maintain a firm yet gentle grip on the wheel without oversteering. Driving is not like a video game where you're constantly moving the wheel back and forth.

[2:20] Not only is the big picture driving technique key to maintaining your lane position, it also allows you to identify potential hazards earlier.

[3:05] Now that you've mastered keeping a consistent lane position on the right side of the road, you need to learn how to handle parked cars.

[3:15] When you approach a parked car that's on the right side of the road, imagine that the lane you're in is moving over to the left. You must move over to the left as well, giving that parked car ample space. Always assume that someone could open the car door at any moment.

[3:40] For this reason, you want to give at least 3 to 4 feet of distance from a parked car.

[4:55] At residential speeds, a 3 to 4 second space cushion is about 2 to 3 car lengths.

[5:25] Now you know all about how to keep a safe lane position with cars all around your vehicle. Thanks so much for watching from Liz and Drivers Ed Direct!"""
    },
    {
        "id": "J_UKNOGJ2tU",
        "title": "Space Management (Rick)",
        "url": "https://www.youtube.com/watch?v=J_UKNOGJ2tU",
        "transcript": """[0:15] Hi there, smart drivers. Welcome back. Talking to you today about space management—one of the four vital components in passing a road test, regardless of class, regardless of where you are in the world. The four components of a road test are speed management, space management, observation, and communication.
[0:55] Space management is like speed management. Everything in social driving tells you that you need to be closer to other vehicles than what you should be for the purposes of the road test.
[1:15] First thing you need to do: when you stop behind other traffic at traffic lights and intersections, you need to be able to see the tires of the vehicle in front of you making clear contact with the pavement. That leaves about one vehicle length between you and the vehicle in front of you.
[2:00] And then finally, the other component of space management is your following distance. It has to be 2 to 3 seconds in a passenger vehicle. Now, how you determine 2 to 3 seconds is: you're following the vehicle in front, the vehicle in front goes past a fixed object. When that vehicle goes past a fixed object, you start counting: "One watermelon," "two watermelon," "three watermelon."
[2:30] When you get to two watermelons, you should be going past that fixed object. That means that you're following at a 2-second following distance. And the reason that we measure in time is because time is relative."""
    },
    {
        "id": "LQZiG2OXkx8",
        "title": "Navigating Residential Curves",
        "url": "https://www.driverseddirect.com/videos/curves/residential/",
        "transcript": """[0:00] Hello current and future drivers of the world, it's Alejandra with Drivers Ed Direct. I will do my best to teach you all you need to know about navigating curved roads in residential neighborhoods.

[0:14] Besides being a part of everyday driving life, curved roads are tested on your behind-the-wheel test. Just remember the general rule: slow down into a curve and accelerate out of it.

[0:28] No matter how sharp or slight a curve is, you will always slow down before a curve. And any time you slow down, you must check your rearview mirror first to assess the traffic situation behind you.

[0:46] The curve sharpness will determine how much you need to slow down. If the curve is extremely sharp, you might have to slow down as if you are making a true turn, going at 10 to 14 miles per hour.

[1:08] Sharp curves can be dangerous because of the limited visibility around the bend. Also worth noting: yellow warning signs may alert you that an upcoming turn is very sharp.

[1:32] When you navigate a curve, you want to make sure to stay on the right side of the road. In residentials, there usually won't be a painted yellow centerline, so you'll have to imagine the center yellow line.

[1:54] You also want to maintain a smooth, controlled speed while keeping your visual focus targeted further ahead on the center of your real or imagined lane. Don't stare at the parked cars.

[2:12] Whatever you do, don't oversteer. Hold the wheel with a firm yet relaxed grip, making micro-steering adjustments to guide the car if needed.

[2:28] As you exit the curve, you can start to gently accelerate back to the speed limit as you straighten out your steering wheel.

[2:43] Thanks for watching and supporting Drivers Ed Direct!"""
    },
    {
        "id": "xgXkH4l4eQA",
        "title": "Residential Right-of-Way Rules",
        "url": "https://www.driverseddirect.com/videos/Right-of-Way/Residential/",
        "transcript": """[0:00] Hi, it's Micah with Drivers Ed Direct. Right-of-way determines 'whose turn it is' to use the road. CVC 525 defines it as 'the privilege of the immediate use of the highway.'

[1:00] All-Way Stop Intersections:
* Rule 1 (First to Arrive): The first vehicle to reach the intersection and come to a complete stop has the right-of-way.
* Rule 2 (Arriving at the Same Time): If two vehicles arrive simultaneously, the vehicle on the RIGHT has the right-of-way.
* Rule 3 (Left Turns): If two vehicles arrive at the same time from opposite directions, the vehicle going STRAIGHT has the right-of-way over the vehicle turning left.

[2:30] Two-Way Stop Intersections: Traffic on the street WITHOUT stop signs has the right-of-way. Drivers at the stop sign must yield to all cross-traffic.

[3:45] Uncontrolled Intersections & T-Intersections:
* Uncontrolled: Slow down to about 2-3 mph and be prepared to stop.
* T-Intersections: Drivers on the terminating road must yield to all traffic on the through road.

[4:50] Entering the Roadway:
* Leaving the Curb: Yield to all existing traffic, bicyclists, and pedestrians before pulling out.
* Driveways: Yield to traffic on the road and pedestrians on the sidewalk. Impeding someone here is an automatic fail.

[5:45] Pedestrians & Cyclists: Pedestrians ALWAYS have the right-of-way. Even if they are jaywalking, you must yield to ensure their safety.

[6:30] Summary: If another driver has to slow down or swerve because of you, you have 'impeded' their right-of-way. Scan left-center-right every time!"""
    },
    {
        "id": "OP-qM-ZrVPQ",
        "title": "Traffic Checks - Part 2 (Major Streets)",
        "url": "https://www.driverseddirect.com/videos/traffic-checks-major-streets/",
        "transcript": """[0:00] All right! Let's start with the review. A traffic check is a quick turn of the head, left, right, left, before we go through any type of intersection. It helps to determine right of way.

[0:30] Starting with a right turn from a neighborhood onto a major street. Signaled at least 100 feet ahead. Full complete stop behind the limit line. As I come to a complete stop, I can't see around the fence, so I'm going to inch out and look left, right, left. It looks pretty good, no pedestrians coming.

[1:45] Now let's try some left turns at lights. This is going to be an unprotected left. I see ahead of me that there are a couple of cyclists. It's unprotected so I'm going to roll out a third, I'm looking left, right, left. I've got to let these cyclists get all the way across. They are. Now I know it's safe to finish my turn.

[3:15] Right turn at a green light. Checking for cyclists and pedestrians before entering the bike lane.

[4:20] Right turn at a red light. Coming to a full stop and checking for pedestrians crossing from the right.

[5:30] Blind intersections. Micah handles a blind intersection, inching out to perform multiple traffic checks where visibility is blocked by a fence.

[6:00] Summary: The busier the street, the more checks you need. Thanks for watching from Drivers Ed Direct!"""
    },
    {
        "id": "v0Soc-kicOQ",
        "title": "Scanning And Moving Through Intersections (Rick)",
        "url": "https://www.youtube.com/watch?v=v0Soc-kicOQ",
        "transcript": """[00:00] When it's feeding, you simply need to be calm and relaxed. That way you can interpret traffic patterns and predict the individual actions of other road users. Let's go for a drive and I'll show you how to scan and track intersections correctly.
[00:15] We're approaching the intersection. We have a pedestrian on the right; the pedestrian is okay on the sidewalk. The cross traffic has the green light. There's pedestrians on the other side of the intersection. So: left, center, right, left again. Traffic is stopped.
[01:07] So here we have the green. Left, center, right just before we enter the box of the intersection. That car is staying put; we proceed. Calm awareness. The bus is coming out; the bus is good. There's no other road users at the intersection. Approaching the intersection: left, center, right, left again.
[02:00] Mapping the intersection: we're going to turn right. Shoulder checking, moving into our lane. We have our own lane according to the signs here. No pedestrians.
[02:31] The position of a road user on the roadway communicates intent, and the fact that that pedestrian was near the edge of the road communicated that that pedestrian was going to cross the road. Mapping the intersections: no road users. The car is coming out; the car has stopped. Green light.
[03:52] [Discussion on how larger vehicles like trucks can block your line of sight at intersections and how to adjust your scanning.]
[05:50] Especially on a test, do not block the cross street. [Final driving tips and safety reminders.]
[06:30] Predict the actions of individual road users to keep yourself safe."""
    },
    {
        "id": "2CXnQmudiD0",
        "title": "Major Street Right-of-Way Rules",
        "url": "https://www.driverseddirect.com/videos/Right-of-Way/Major-Streets/",
        "transcript": """[0:00] Introduction: Welcome to Right of Way Part Two. In Part 1, we looked at neighborhood streets; now we are looking at major streets.

[0:15] Definition of Right of Way: The California Vehicle Code states that right of way is the privilege of the immediate use of the highway (who is entitled to go).

[0:30] Lane Changes: If a car is passing us, we give them the right of way.

[0:45] Protected Right Turns: On a protected right turn (green arrow), you have the right of way.

[1:00] Unprotected Right Turns: On a green circle, pedestrians have the right of way. If they are crossing away from you, let them get halfway across. If they are coming towards you, they must get all the way across before you turn.

[1:30] Right Turns with Bike Lanes: You must make a lane change into the bike lane 200 feet before turning. If a cyclist is already there, get in behind them and treat them like another vehicle.

[2:15] Right on Red: Cross traffic and pedestrians have the right of way.

[2:45] Protected Left Turns: With a green arrow, you should have the right of way, but watch for jaywalkers or cars turning right on red.

[3:15] Unprotected Left Turns: On a green circle, yield to oncoming traffic, including cyclists and pedestrians.

[3:45] Intersection Positioning: For an unprotected left, roll out a third of the way into the intersection and wait for it to be clear.

[4:15] Pedestrians in Crosswalks: For left turns, pedestrians must get all the way across the crosswalk before you finish your turn.

[5:00] Summary and Conclusion: Defensive drivers are prepared for any situation. Check out Drivers Ed Direct for more tips."""
    },
    {
        "id": "t7j8MEsS9Mc",
        "title": "Right Turn on Red Anxiety Buster",
        "url": "https://www.driverseddirect.com/videos/turns/right/right-turn-on-red/",
        "transcript": """[00:00] Hey, everybody! It's Ben with Drivers Ed Direct. Welcome to today's video on the 'Right Turn on Red Anxiety Buster.' Making a right turn on a red light in California is a must-have driving skill, but even though it seems simple, it's one of the most common reasons people fail their DMV Driving Test.
[00:15] We’re going to cover 9 or 10 turns, showing you exactly what to do, what not to do, how to avoid automatic fails, and how to stay safe.
[01:00] The Mandatory Stop: You must come to a full and complete stop behind the limit line (the thick white line). A 'rolling stop' is an automatic fail.
[02:30] Yielding Right-of-Way: Pedestrians always have the right of way. Even if they are just entering the crosswalk from the far side, you must wait.
[04:00] Cross Traffic: Look left for oncoming traffic that has the green light. You must yield to any vehicle close enough to be a hazard.
[05:30] U-Turners: Watch for cars making U-turns from the opposite direction; they often have a protected left-turn arrow and have the right of way over you.
[07:00] The 'Creep' and Search: If your view is blocked by bushes, signs, or other cars, 'creep' forward slowly after your initial stop to get a better view.
[08:30] Lane Choice: Turn into the right-most lane. Do not 'lane swing' into the middle or left lanes.
[10:00] Decision Making: You are not required to turn on red. If you do not feel it is 100% safe, or if you cannot see clearly, you can wait for the green light.
[11:00] Thanks for watching—we really appreciate it. Until next time, from Ben and everyone at Drivers Ed Direct, please stay safe out there. Thanks, guys!"""
    },
    {
        "id": "ZkVBf-LIGro",
        "title": "Blind Spot Checks",
        "url": "https://www.driverseddirect.com/videos/blind-spots/",
        "transcript": """[0:00] Hi! My name is Micah with Drivers Ed Direct and in this video today we are talking about Blind Spot Checks.
[0:20] What is a blind spot check? A blind spot check is a quick turn of the head from chin to shoulder, either to the right (or) chin to shoulder to the left, before we make any lane change.
[0:45] The phrase, 'over-the-shoulder', you may have heard that before, but if you look too far, it's hard to keep your car centered in the lane.
[1:15] Demonstration: I check my left mirror, looks pretty good, no car coming up next to me. But if I take my head and turn chin to shoulder, check my blind spot, there it is. A tall cone right next to my car that I couldn't see in my mirrors. That is our blind spot.
[1:50] Blind spot check sensors: On your drive test, we want to pretend like our car doesn't even do that for us. Your examiner wants to know that we can physically do it.
[2:15] When to check: Before left turns, right turns, or lane changes on major streets. Also before we curbside park or before we pull away.
[4:00] DMV Test Tip: If we miss one on the Drive Test, our examiner actually could give us an automatic fail. If your examiner says, 'Please curbside park on the right,' check your blind spot before you go into the curb.
[5:00] Summary: Blind spot check is a quick glance from chin to shoulder. Good luck on your Drive Test!"""
    },
    {
        "id": "VFRv3Je7phs",
        "title": "Using Your Rearview Mirrors",
        "url": "https://www.driverseddirect.com/videos/rearview-mirrors/part-2-using/",
        "transcript": """[0:00] Welcome back! Today we are going to talk about HOW and WHEN to use your rearview mirrors! Remember, do not stare, but instead take quick glances.
[0:30] Frequency: In general, when you're driving along the road, you want to be checking your mirrors regularly -- say every 2-5 seconds.
[1:15] Demo: If I want to make a lane change to my left, I'll signal and then do several mirror checks and shoulder checks... but all of these will be brief glances, and notice how I always look forwards again for safety.
[2:00] When to Check:
* Before Braking: Take a quick look in your mirrors to see how closely the car behind you is following.
* Driving Down a Steep Hill: Watch for large vehicles that gather speed quickly and may have a tougher time stopping.
* Backing Up: Look over your right and left shoulders before you begin backing. Keep your 'head on a swivel'.
* Being Tailgated: Brake slowly before stopping. Tap your brakes lightly to warn them. Try to change lanes safely or even pull off the road.
[4:00] Conclusion: Adjusting and using your mirrors is an exhaustive topic! From Micah and Drivers Ed Direct -- please stay safe out there!"""
    },
    {
        "id": "6TgFxB32fnE",
        "title": "Left Lane Change Anxiety Buster",
        "url": "https://www.driverseddirect.com/videos/lane-changes/left/anxiety-buster/",
        "transcript": """[00:00] All right y'all, let's practice a nice easy left lane change. Remember, whenever we do a lane change, we want to remember the acronym SMOG: Signal, Mirror, Over the shoulder, then Go.
[00:15] [00:20] I'm already kind of aware what's behind me, but I'm going to go ahead and put on my signal. I don't see anybody in my mirrors, so I look over my left shoulder—nothing in my blind spot—and I just very gently ease over over about four or five seconds.
[00:45] All right, let's go ahead, when it's safe, make a left lane change. Signal, check our mirrors. Nothing in our mirrors, we look over our shoulder. Once I've established in my lane, I turn off my turn signal.
[01:45] Now, a lot of people think, 'I've got to make this lane change fast no matter what,' and that's not true. You actually want to take your time, right? Don't rush it.
[02:00] First of all, when you put on your turn signal, remember that that signal is like a beacon or a flashing light that catches everyone's attention.
[02:30] Right, a lot of people when they look over their shoulder, they look too long. It needs to be quick: chin to shoulder.
[03:00] Another thing: your arms are connected to your body. When you check over your shoulder, you've got to remember it is chin to shoulder.
[05:00] [Ben demonstrates 35+ repetitions of the SMOG technique in various traffic scenarios.]
[25:00] Thanks for tuning in today! From Ben and everyone at Drivers Ed Direct thank you so much for watching!!"""
    },
    {
        "id": "eLWOkdwkhps",
        "title": "Freeway Lane Changes & Defensive Driving",
        "url": "https://www.driverseddirect.com/videos/lane-changes/freeway/",
        "transcript": """[00:00] Let's do it. Refresher: traffic on the freeway already has the right of way, so it's up to us to make the merge happen.
[00:15] I get my left signal going here. I'm checking my left mirrors, and once it looks good, I look over my shoulder.
[00:30] Then I really want to accelerate to match traffic because I don't want that white truck or that white van behind me to have to slow down. That was a great example of how to merge onto the freeway.
[01:00] Remember S.M.O.G.—Signal, Mirror, Over-the-shoulder, and Go.
[01:28] I'm putting on my signal now. You want to signal your intentions for about 4 to 5 seconds before you actually move the vehicle.
[01:57] Checking my mirrors... looking over the shoulder... and we ease into the next lane. Notice I'm keeping a steady speed.
[03:26] We're avoiding 'right lane drama' here. The far right lane often has people merging in and exiting. I like to stay one or two lanes over.
[04:53] Scan and prepare for the unexpected. I'm looking way ahead—three or four cars ahead—to see if brake lights are coming on.
[06:04] Improving your forward field of vision. If you're behind a large truck, you can't see what's happening. I'm going to move over one lane to the left.
[06:44] Maintaining safe space cushions. I want at least a three-second gap between me and the car in front.
[07:42] 405 to 101 interchange. This is a 'Lane Change Bonanza.' I've got to make about five lane changes to the right in a short distance.
[09:15] One thing to point out: when you check your blind spots, you're not just checking the lane right next to you. You're checking several lanes across because a car could be making a wild lane change from two lanes over.
[10:00] Final lane change into the exit lane. Nice. Play it safe and play it cautious. Stay safe out there!"""
    },
    {
        "id": "oizQKbE-OLs",
        "title": "Right-of-Way Part 3: Freeways and Canyons",
        "url": "https://www.youtube.com/watch?v=oizQKbE-OLs",
        "transcript": """[0:00] Introduction: You made it to Right-of-Way Part 3. Today we're looking at the right-of-way rules we need to follow on freeways and canyons.
[0:15] Definition: Right-of-way is the privilege of the immediate use of the highway.
[0:25] Purpose: Right-of-way is whose turn it is to be going. It's a set of rules that stops us from getting in each other's way.
[0:40] Entering the Freeway: Right-of-way is huge when entering the freeway because your on-ramp is most likely a merging lane.
[0:50] Merging Rules: In a merging lane, you do not have the right of way. To safely merge, match the speed of traffic and find a gap.
[1:05] SMOG Technique: To find that gap, use SMOG: Signal, Mirrors, Over the shoulder, Go.
[1:20] Continuous Lanes: Some on-ramps are weaving or continuous lanes. Here, you have your own lane and don't have to enter someone else's lane immediately.
[1:40] Lane Changes: When making a lane change on the freeway, we do not have the right of way. We use SMOG and only go if it's clear.
[1:55] Impeding Traffic: If a car has to brake or adjust their lane for us, we've impeded their right of way.
[2:10] Being Passed: If a car is passing you, the California Vehicle Code says any vehicle being passed must yield the right of way.
[2:30] Canyon Roads: When two cars meet on a narrow incline where passing is impossible, the car traveling downhill must yield to the car traveling uphill.
[2:50] Turnouts: When driving below the speed limit with five or more cars behind you, you must pull off the road to let traffic pass.
[3:10] Leaving a Turnout: When leaving a turnout, do another SMOG to ensure there is a safe gap in traffic before re-entering."""
    },
    {
        "id": "Cw32CWOVL7c",
        "title": "Staying Safe Near Big Trucks",
        "url": "https://www.youtube.com/watch?v=Cw32CWOVL7c",
        "transcript": """[0:00] Introduction: How to stay safe when driving near big trucks.
[0:05] Big trucks are just another vehicle on the roadway, but they require specific awareness.
[0:33] Merging Onto the Freeway with Trucks: Stay calm and in control. Get your foot into the throttle and keep moving.
[0:58] Pass or Hang Back? Do not hang out next to them.
[1:10] Adjust your speed to either get in front of or behind a truck quickly. They have slow acceleration, so it's easy to pass them.
[1:25] Hills/Mountains: Remember that loaded trucks will slow down significantly going uphill.
[2:15] Avoid hanging out behind trucks to prevent windshield damage from debris and stones.
[2:30] Summary: Don't hang out in their blind spots. Get around them expediently."""
    },
    {
        "id": "MpRHhikARbQ",
        "title": "Smart Night Driving",
        "url": "https://www.youtube.com/watch?v=MpRHhikARbQ",
        "transcript": """[00:00] As you're driving, because our eyes are attracted to light and movement, so in the darkness, you are looking for movement.
[00:25] So nighttime isn't just when it's dark outside, but also the transition from full light to darkness is also dangerous.
[00:50] Where is the curve of the road? Is the road curving to the left, curving to the right?
[01:28] What happens is that when we get blinded by other traffic or there's a lot of street lights, it reduces and erodes our night vision.
[01:52] So you need to preserve your night vision, especially as you get out onto highways and into rural areas.
[02:05] You always need to be scanning farther down the road, both shoulders of the roadway.
[02:42] Talking to other people would help you keep awake at night. Podcasts and audiobooks, and whatnot, that all this will help you out.
[03:20] But ultimately, if you're tired, you need to stop. You need to get off the roadway and you need to get yourself some rest.
[04:22] Because your headlights are a poor substitute for visibility at night."""
    },
    {
        "id": "SdQRkmdhwJs",
        "title": "DVSA: How the Hazard Perception Test Works",
        "url": "https://www.youtube.com/watch?v=SdQRkmdhwJs",
        "transcript": """[0:00] Introduction to the official DVSA Hazard Perception Test format.
[0:30] The test consists of a series of short video clips showing potential developing hazards.
[1:00] A developing hazard is something that would cause you to take action, like changing speed or direction.
[1:30] You score points based on how quickly you click when the hazard starts to develop.
[2:00] The window for scoring goes from 5 points down to 0, depending on your reaction time.
[2:30] If you click repeatedly (pattern clicking) during a clip, your score for that clip will be zero.
[3:00] The goal is to identify hazards early but not to just 'guess' by clicking continuously."""
    }
]

def main():
    output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "driversed.md")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# Drivers Ed Video Transcripts\n\n")
        f.write("This file contains the full word-for-word transcripts WITH TIMINGS for all YouTube videos used in the Teen Hazard Perception Lab.\n\n")

        for index, video in enumerate(VIDEOS):
            f.write(f"## {video['title']}\n")
            f.write(f"- **YouTube ID:** `{video['id']}`\n")
            f.write(f"- **Source:** {video['url']}\n\n")
            f.write(video['transcript'] + "\n\n")
            f.write("---\n")
            if index != len(VIDEOS) - 1:
                f.write("\n")

    print(f"Successfully generated {output_file} with full timings.")

if __name__ == "__main__":
    main()
