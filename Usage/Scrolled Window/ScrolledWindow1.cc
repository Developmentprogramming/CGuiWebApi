// Basic Scrolled Window
#include <CGUI.hh>

using namespace CGui;

int main(int argc, char *argv[])
{
  Init init(argc, argv); // Initialize CGui

  Window window(TOPLEVEL, "Scrolled Window", CEN); // Create a new window

  ScrolledWindow scrolled_window(AUTOMATIC, AUTOMATIC); /* Create a new
  scrolled window */
  /* Note: Now this scrolled_window is scrollable so add all the widgets
  in scrolled_window rather then window */

  window.Add(scrolled_window); /* add scrolled_window in window */

  window.DefaultSize(640, 480); // Set the window default size
  window.InternalWidth(10); // Set internal padding of 10
  window.ShowAll(); // Show all widget inside window recursively
  return 0;
}