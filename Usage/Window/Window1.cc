// Basic window
#include <CGUI.hh>

using namespace CGui;

int main(int argc, char *argv[])
{
  Init init(argc, argv); // Initilize the CGui

  Window window(TOPLEVEL, "Window", CEN); // Create a new window

  window.DefaultSize(640, 480); // Set the window default size
  window.InternalWidth(10); // Set internal padding of 10
  window.ShowAll(); // Show all widget inside window recursively
  return 0;
}