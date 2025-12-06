# Do I know what I am doing?

- yes, I am trying to update my `day5` code to work for five different machines, where the output of the previous machine is the one of the input to the next machine. Here each machine will get its own input source and output source.
And the machines will read the input twice and after the first read, I have to change the input source value. 

And the inputs were some combination I have to make where what a machine excepts is between `0-4`.

Each machine when starting, takes two inputs. *First* the random Phase setting. and the second the input of the previous machine. (for the first machine it will be 0).

And repeat this running of each machine from the previous input till the last machine.

After everything is done, I have to say what is the largest output.

# Do I need to ask a question?

- Yes. Is my existing code okay? Or it needs refactoring?

# Is my existing code okay? or it needs refactoring?

yes, My code need refactoring. The issues are :
## Code
- Need to add a blank line after each function.
- make the identation consistent.
- remove all the console.logs.
- remove the chunk related code which is currently not used.

## Logical
- Need to extract logics to individual functions. (getArgTypes, getArgs)
- Remove shouldSave key and make the add and mul save them.

# Can the refactoring be made smaller?
- [x] Yes. First I check if the code is working properly.
- [x] Then add a line after each function and commit it.
- [x] Then make the identation proper and commit it.
- [x] Remove all the console.logs and commit it.
- [x] Remove chunk code. Commit it. Test it.
- [x] Then re-evalute the code and if everything is okay, I will move to `Logical` refactoring.
---
- Extract the logic of opcode breaking into a function. Test it. Commit it.
- Extract the fetching the arguments to a different function. Test it. Commit it.
- Remove the `shouldSave` key and make the add and mul save them. Test it. Commit it.
