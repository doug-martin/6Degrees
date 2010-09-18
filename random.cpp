#include "IGRAPH.h"
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <limits>

using namespace std;

int main()
{
    srand(time(NULL));
    GRAPH G;
    //double V = 150 * 6 + (rand() % numeric_limits<double>::max());
    double V = static_cast<double>(rand()) * numeric_limits<double>::max() / static_cast<double>(RAND_MAX) + 150000;
    double E = 150;
    for (int i = 1; i < 7; i++)
    {
        E *= 150;
    }
    cout << E;

    double p = 2 * E / V / (V - 1);

    for (double i = 0; i < V; i++)
        for (double j = 0; j < i; j++)
            if (rand() < p*RAND_MAX)
                G.insertEdge(i, j);

    return 0;
}

