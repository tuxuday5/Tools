#!/usr/bin/perl -I.
use SplitSeqBySum;
use Data::Dumper ;
use Getopt::Long ;
use Pod::Usage;

my ($End,$Splits);

GetOptions("end=i" => \$End , "splits=i" => \$Splits);

pod2usage( '-verbose' => 10 ) if not ($End and $Splits);

my $SplitDistance = SplitSeqBySum::GetEqualDistanceFor($End,$Splits);
print(Dumper($SplitDistance));

__END__

=head1 NAME

splitseq.pl - split by sequence magnaitude

=head1 SYNOPSIS

splitseq.pl [options] 

Options:
--splits          Required splits
--end             Run sequence till this number

=head1 OPTIONS

=over 8

=item B<--end>

Run sequence till this number 

=item B<--splits>

Required splits

=back

=head1 DESCRIPTION

B<This program> will read split by sum of sequence.

=cut
