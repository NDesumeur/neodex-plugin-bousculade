# Jostle

A pixel art board game: elephants against rhinos on a 5 × 5 board, with three rocks in the middle. The first side to push a rock off the board wins… as long as it is the right animal behind it. Against the computer (three levels) or two players on the same PC.

*Version française : [README.md](README.md)*

## Your turn: one single action

- **Enter**: an animal from your reserve lands on a free edge square.
- **Move** one square (up, down, left, right) to a free square.
- **Turn** in place.
- **Leave** the board through an edge: the animal goes back to your reserve.
- **Push** straight ahead, the way it faces (or while entering onto an occupied edge square).

After an entry, a move or a turn, you choose **which way the animal faces**: that is what counts for pushing.

## Pushing

The whole line of pieces in front of the animal moves one square, if the strength is enough:

- each animal in the line facing **the push direction** adds **+1** (the pusher counts too);
- each animal facing **against** it removes **1**;
- animals facing sideways don't count;
- each **rock** needs **1** strength.

An animal pushed off the board goes back to its side's reserve.

**Before pushing**, the strength is shown: a green **+** on each animal pushing, a red **−** on each animal facing against, a grey dot on each rock, and the count at the top ("+2 −1 = 1 against 1 rock: it goes!"). When the strength is not enough, a grey arrow shows it instead of the orange one.

The elephant that pushes **trumpets** and flaps its ears, the rhino **snorts**; at rest, ears twitch now and then.

## Winning

When a rock goes off the board, the **nearest animal behind it** facing the push direction wins for its side, **even if the opponent** did the pushing!

## Controls

- **Mouse**: click an animal (or your reserve), then a target: green square = go there, orange arrow = push, red arrow = leave, grey arrow = not enough strength (hover an arrow to see the count). Then click the arrow for the facing.
- **Keyboard**: arrows move between zones, **Enter** or **Space** picks, **Esc** cancels.
- **Full screen**: the button beside the board (Esc to come back). The board takes all the room of the window, small or large.

## The computer

- **Easy**: looks one move ahead and sometimes slips.
- **Normal**: sees its answer to your move.
- **Hard**: looks three moves ahead.

## Statistics

The Records panel counts your **wins** at each level and the **two-player games**.

## Data and sync

Your statistics and choices (level, side) are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Jostle → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
