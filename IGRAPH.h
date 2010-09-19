#ifndef GRAPH_H
#define GRAPH_H
#include <iostream>
#include <string>
#include <iterator>
#include <unordered_map>
#include <vector>
#include <queue>


using namespace std;
typedef unordered_multimap<double, double> mapType;

class GRAPH
{
    public:
    mapType adjacencyMap;
    vector<double> visitMap;
    queue<double> searchMap;
    int V, E;

    GRAPH();
    void insertEdge(double, double);
    void removeEdge(double, double);
    void printMap();
    void lookup(double);
    bool bfs(double, double);
    bool visit(double);

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
        mapType::const_iterator it = adjacencyMap.find(e1);
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

void GRAPH::lookup(double key)
{
    cout << key << ": ";
    pair<mapType::const_iterator, mapType::const_iterator> p = adjacencyMap.equal_range(key);
    for (mapType::const_iterator i = p.first; i != p.second; ++i)
        cout << (*i).second << " ";
    cout << endl;
}

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
}

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
