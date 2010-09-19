#ifndef GRAPH_H
#define GRAPH_H
#include <iostream>
#include <string>
#include <iterator>
#include <unordered_map>


using namespace std;
typedef unordered_multimap<double, double> mapType;

class GRAPH
{
    public:
    mapType adjacencyMap;
    int V, E;

    GRAPH();
    void insertEdge(double, double);
    void removeEdge(double, double);
    void printMap();

};

GRAPH::GRAPH()
{
    V = 0;
    E = 0;
}

void GRAPH::insertEdge(double e1, double e2)
{
    adjacencyMap.insert(mapType::value_type(e1, e2));
    E++;
}

void GRAPH::removeEdge(double e1, double e2)
{
    double toRemove;
    do
    {
        mapType::Const_Iterator it = adjacencyMap.find(e1);
        toRemove = it->second;
        if (e2 != toRemove)
        {
            ++it;
        }
        else
            adjacencyMap.erase(it);
    } while(e2 != toRemove);
}

void GRAPH::printMap()
{
    for(mapType::const_iterator it = adjacencyMap.begin(); it != adjacencyMap.end(); ++it)
    {
        cout << "[" << it->first << ", " << it->second << "] ";
    }
    cout << endl;
}
#endif
