// Do I know what I should do? 
// I need to find total how many direct and indirect orbits exists.
// Any object on the space is orbiting around another object. Except `COM`.
// So I will have all the objects and what are they orbiting around. And then check what the orbited object is orbiting.

// Example: if x)y y)z => that means z is directly y and indirectly orbiting around x. here it is 2 and y is also orbiting x then it is 1 ===> total 3 orbits.

// Do I need to question?
// Yes, I need to ask How I am going to count a single object's orbit count.

// How am I going to count a single object's orbit count.
// First I should plot the orbit in a way that I understand. But for now I will leave this to the last and do other tasks to with manually plotted.
// I will see what current element is orbiting around.
// Then increase the count.
// => Then find what the parent is orbiting around.
// => if it is orbiting around something, find the what it is orbiting.
// => increase the count.
// => repeat till we find something which don't revolve around anything.

// Can this be made smaller?
// yes - I can only do for single object. It will take all orbits data, and find what it is orbiting around. and increase the count.

// Can this be made smaller?
// yes - I can break it into two tasks. First being finding what it is revolving around. If yes return it or else return nothing.
// And second being if it increase the count if what it is provided is not available in the all orbits data.

// Can the second task smaller?
// yes - I can make it into two tasks. One check if given object is a valid object in the space.
// Second if valid increase the count.

