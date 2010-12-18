#ifndef GRAPH_H
#define GRAPH_H
#include <iostream>
#include <string>
#include <iterator>
#include <unordered_map>
#include <vector>
#include <queue>
//#include <v8.h>

using namespace std;
typedef unordered_multimap<double, double> mapType;

class GRAPH
{
    public:
    mapType adjacencyMap;           // a map showing nodes and neighbors
    vector<double> visitMap;        // a vector holding lists of visited nodes
    queue<double> searchMap;        // map holding search entries
    int V, E;                       // number of nodes and edges

    GRAPH();
    void insertEdge(double, double);
    void removeEdge(double, double);
    void printMap();
    void lookup(double);
    bool bfs(double, double);
    bool visit(double);

};

// GRAPH constructor setting nodes and edges to 0
GRAPH::GRAPH()
{
    V = 0;
    E = 0;
}

// inserts two nodes as neighbors, increments #edges by 1
void GRAPH::insertEdge(double e1, double e2)
{
    adjacencyMap.insert(mapType::value_type(e1, e2));
    E++;
}

//erases an edge
void GRAPH::removeEdge(double e1, double e2)
{
    double toRemove;
    do
    {
        mapType::const_iterator it = adjacencyMap.find(e1);
        toRemove = it->second;
        if (e2 != toRemove)
        {
            ++it;
        }
        else
            adjacencyMap.erase(it);
    } while(e2 != toRemove);
    E--;
}

// prints a list of all nodes, along with who they are connected to
void GRAPH::printMap()
{
    for(mapType::const_iterator it = adjacencyMap.begin(); it != adjacencyMap.end(); ++it)
    {
        cout << "[" << it->first << ", " << it->second << "] ";
    }
    cout << endl;
}

// function designed to find a node, and then print its neighbors
void GRAPH::lookup(double key)
{
    cout << key << ": ";
    pair<mapType::const_iterator, mapType::const_iterator> p = adjacencyMap.equal_range(key);
    for (mapType::const_iterator i = p.first; i != p.second; ++i)
        cout << (*i).second << " ";
    cout << endl;
}

// performs a boolean breadth-first-search, returns true if two nodes
// are connected to each other
bool GRAPH::bfs(double src, double dest)
{
    bool flag = false;
    double current;
    pair<mapType::const_iterator, mapType::const_iterator> p;
    mapType::const_iterator i;
    while(!searchMap.empty())
        searchMap.pop();

    mapType::const_iterator it = adjacencyMap.find(src);
    searchMap.push(it->first);
    do
    {
        current = searchMap.front();
        searchMap.pop();
        if (current == dest)
            flag = true;
        if(visit(current))
        {
            p = adjacencyMap.equal_range(src);
            for(i = p.first; i != p.second; ++i)
            {
                if(visit((*i).second))
                    searchMap.push((*i).second);
            }
        }
    } while(!searchMap.empty() && current != dest);

    return flag;
    visitMap.resize(0);
}

// attempts to "visit" a node - marking it as visited if
// it hasn't, or returning false if it has
bool GRAPH::visit(double src)
{
    bool flag = false;
    if (visitMap.size() < src)
    {
        visitMap.resize(src - visitMap.size(), 0);
        visitMap[src] = 1;
        flag = true;
    }
    else
    {
        if (visitMap[src] = 1)
            flag = false;
        else
        {
            visitMap[src] = 1;
            flag = true;
        }
    }
    return flag;
}
#endif
