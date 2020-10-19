#!/usr/bin/perl -I.
use SplitSeqBySum;
use Data::Dumper ;

my $SplitDistance = SplitSeqBySum::GetEqualDistanceFor(5000000,3);
print(Dumper($SplitDistance));
