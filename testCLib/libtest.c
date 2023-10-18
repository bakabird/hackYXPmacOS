#include <stdlib.h>
#include <stdio.h>

FILE *my_fopen(const char *filename, const char *mode)
{
    printf("lib: %s\n", filename);
    return fopen(filename, mode);
}