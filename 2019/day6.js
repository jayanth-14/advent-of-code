// Do I know what I should do? 
// I need to find total how many direct and indirect orbits exists.
// Any object on the space is orbiting around another object. Except `COM`.
// So I will have all the objects and what are they orbiting around. And then check what the orbited object is orbiting.

// Example: if x)y y)z => that means z is directly y and indirectly orbiting around x. here it is 2 and y is also orbiting x then it is 1 ===> total 3 orbits.

// Do I need to question?
// Yes, I need to ask How I am going to count a single object's orbit count.

// How am I going to count a single object's orbit count.
// I will see what current element is orbiting around.
// Then increase the count.
// => Then find what the parent is orbiting around.
// => if it is orbiting around something, find the what it is orbiting.
// => increase the count.
// => repeat till we find something which don't revolve around anything.


