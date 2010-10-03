#include <iostream>
#include "IGRAPH.h"

using namespace std;

int main()
{
    GRAPH G;
    G.insertEdge(0, 1);
    G.insertEdge(0, 2);
    G.insertEdge(0, 3);
    G.insertEdge(1, 2);
    G.insertEdge(3, 4);
    G.lookup(0);

    cout << endl;

    cout << "before removing {0, 1}, {0, 3}" << endl;
    G.printMap();
    G.removeEdge(0, 1);
    G.removeEdge(0, 3);
    cout << "\nafter removing the above" << endl;
    G.printMap();
    G.removeEdge(0, 2);
    cout << "\n after removing {0, 2}" << endl;
    G.printMap();
    return 0;
}
