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
    map<string, set<string> > adjacencyMap;
    int V, E;

    GRAPH();
    bool contains(string);
    bool insertVertex(string);
    bool insertEdge(string, string);
    //void printMap();
};

GRAPH::GRAPH()
{
    V = 0;
    E = 0;
}

bool GRAPH::contains(string vert)
{
    bool flag = false;
    if (V)
    {
        map<string, set<string> >::iterator iter = adjacencyMap.find(vert);
        if (iter != adjacencyMap.end())
            flag = true;
        else
            flag = false;
    }
    
    else
        flag =  false;
    return flag;
}

bool GRAPH::insertVertex(string vert)
{
    bool flag = false;
    if (contains(vert))
        flag = false;
    else
    {
        set<string> newSet;
        adjacencyMap.insert(make_pair(vert, newSet));
        V++;
        flag = true;
    }
    return flag;
}

bool GRAPH::insertEdge(string e1, string e2)
{
    bool flag = false;
    if (!contains(e1))
        flag = insertVertex(e1);
    if (!contains(e2))
        flag = insertVertex(e2);

    map<string, set<string> >::iterator iter = adjacencyMap.find(e1);
    set<string> setCopy = iter->second;
    setCopy.insert(e2);
    adjacencyMap.insert(make_pair(e1, setCopy));

    iter = adjacencyMap.find(e2);
    setCopy = iter->second;
    setCopy.insert(e1);
    adjacencyMap.insert(make_pair(e2, setCopy));

    E++;
    return flag;
}

/*void GRAPH::printMap()
{
    map<string, set<string> >::iterator iter = adjacencyMap.begin();
    set<string> sCopy;
    set<string>::iterator sIter;
    while(iter != adjacencyMap.end())
    {
        cout << iter->first << ": ";
        sCopy = iter->second;
        for (sIter = sCopy.begin(); sIter != sCopy.end(); sIter++)
            cout << *sIter << ", ";
        cout << endl;
        iter++;
    }
}*/
#endif
