#ifndef GRAPH_H
#define GRAPH_H
#include <iostream>
#include <set>
#include <string>
#include <map>
#include <iterator>

using namespace std;

class GRAPH
{
    public:
    map<double, set<double> > adjacencyMap;
    int V, E;

    GRAPH();
    bool contains(double);
    bool insertVertex(double);
    bool insertEdge(double, double);
};

GRAPH::GRAPH()
{
    V = 0;
    E = 0;
}

bool GRAPH::contains(double vert)
{
    bool flag = false;
    if (V)
    {
        map<double, set<double> >::iterator iter = adjacencyMap.find(vert);
        if (iter != adjacencyMap.end())
            flag = true;
        else
            flag = false;
    }
    
    else
        flag =  false;
    return flag;
}

bool GRAPH::insertVertex(double vert)
{
    bool flag = false;
    if (contains(vert))
        flag = false;
    else
    {
        set<double> newSet;
        adjacencyMap.insert(make_pair(vert, newSet));
        V++;
        flag = true;
    }
    return flag;
}

bool GRAPH::insertEdge(double e1, double e2)
{
    bool flag = false;
    if (!contains(e1))
        flag = insertVertex(e1);
    if (!contains(e2))
        flag = insertVertex(e2);

    map<double, set<double> >::iterator iter = adjacencyMap.find(e1);
    set<double> setCopy = iter->second;
    setCopy.insert(e2);
    set<double>::iterator Siter = setCopy.begin();
    adjacencyMap.insert(make_pair(e1, setCopy));

    iter = adjacencyMap.find(e2);
    setCopy = iter->second;
    setCopy.insert(e1);
    adjacencyMap.insert(make_pair(e2, setCopy));

    E++;
    return flag;
}

#endif
